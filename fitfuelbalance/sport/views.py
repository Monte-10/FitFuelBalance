from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view
from django.utils import timezone
from django.http import HttpResponse, Http404
from io import BytesIO
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
import os
from django.conf import settings
from .models import *
from .serializers import *

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer

class TrainingExerciseViewSet(viewsets.ModelViewSet):
    queryset = TrainingExercise.objects.all()
    serializer_class = TrainingExerciseSerializer

class TodayTrainingView(APIView):
    def get(self, request, *args, **kwargs):
        today = timezone.now().date()
        user_id = request.query_params.get('user')  # Obtiene el ID del usuario desde los parámetros de la URL

        if not user_id:
            return Response({'detail': 'Se requiere el ID del usuario.'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtra los entrenamientos por fecha y usuario
        trainings = Training.objects.filter(date=today, user_id=user_id)

        serializer = TrainingSerializer(trainings, many=True)
        return Response(serializer.data)
    
class TrainingByDateView(APIView):
    def get(self, request, date, *args, **kwargs):
        date = timezone.datetime.strptime(date, '%Y-%m-%d').date()
        user = request.user
        print('user:', user)
        print('date:', date)
        
        sessions = Training.objects.filter(user=user, date=date)
        
        serializer = TrainingSerializer(sessions, many=True)
        return Response(serializer.data)

class WeekTrainingViewSet(viewsets.ModelViewSet):
    queryset = WeekTraining.objects.all()
    serializer_class = WeekTrainingSerializer

@api_view(['POST'])
def assign_week_training(request):
    try:
        user_id = request.data.get('userId')
        week_training_id = request.data.get('weekTrainingId')
        start_date = request.data.get('startDate')
        
        if not user_id or not week_training_id or not start_date:
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.get(id=user_id)
        week_training = WeekTraining.objects.get(id=week_training_id)
        assigned_week_training = AssignedWeekTraining.objects.create(
            user=user,
            week_training=week_training,
            start_date=start_date
        )
        
        response_data = {
            'assignedWeekTrainingId': assigned_week_training.id,
            'userId': user.id,
            'weekTrainingId': week_training.id,
            'startDate': start_date,
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except WeekTraining.DoesNotExist:
        return Response({'error': 'WeekTraining not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def generate_week_training_pdf(request, assigned_week_id):
    try:
        assigned_week_training = AssignedWeekTraining.objects.get(id=assigned_week_id)
        week_training = assigned_week_training.week_training
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Week_Training_{week_training.name}.pdf"'

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=landscape(letter))
        elements = []
        styles = getSampleStyleSheet()

        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        day_names = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

        for day, day_name in zip(days, day_names):
            elements.append(Spacer(1, 24))
            day_header = Paragraph(day_name, styles['Title'])
            elements.append(day_header)
            elements.append(Spacer(1, 12))

            table_data = [['Ejercicio', 'Series', 'Repeticiones', 'Peso', 'Tiempo']]

            trainings = getattr(week_training, day).all()
            for training in trainings:
                for te in training.trainingexercise_set.all():
                    table_data.append([
                        Paragraph(te.exercise.name, styles['BodyText']),
                        Paragraph(str(te.sets), styles['BodyText']),
                        Paragraph(str(te.repetitions), styles['BodyText']),
                        Paragraph(str(te.weight) if te.weight else 'N/A', styles['BodyText']),
                        Paragraph(str(te.time) if te.time else 'N/A', styles['BodyText'])
                    ])

            col_widths = [doc.width * 0.25, doc.width * 0.15, doc.width * 0.15, doc.width * 0.15, doc.width * 0.15]

            t = Table(table_data, colWidths=col_widths)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('BOX', (0,0), (-1,-1), 2, colors.black),
                ('GRID', (0,0), (-1,-1), 1, colors.black),
            ]))
            elements.append(t)
            elements.append(PageBreak())

        doc.build(elements)
        pdf = buffer.getvalue()
        buffer.close()

        pdf_dir = os.path.join(settings.MEDIA_ROOT, 'pdfs')
        if not os.path.exists(pdf_dir):
            os.makedirs(pdf_dir)
        pdf_path = os.path.join(pdf_dir, f"Week_Training_{week_training.name}.pdf")

        with open(pdf_path, 'wb') as f:
            f.write(pdf)

        response.write(pdf)
        return response

    except AssignedWeekTraining.DoesNotExist:
        return HttpResponse("La semana de entrenamiento asignada no existe.", status=404)


@api_view(['GET'])
def assigned_week_trainings_view(request):
    if not request.user.is_regular_user:
        return Response({"error": "Solo los usuarios regulares pueden ver los entrenamientos asignados."}, status=status.HTTP_403_FORBIDDEN)

    today = timezone.now().date()
    assigned_week_trainings = AssignedWeekTraining.objects.filter(user=request.user, start_date__lte=today).order_by('-start_date')
    serializer = AssignedWeekTrainingSerializer(assigned_week_trainings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)