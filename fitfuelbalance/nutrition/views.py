from io import BytesIO
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .forms import *
from .models import *
from .filters import *
from rest_framework import viewsets
from .serializers import *
from .utils import import_foods_from_csv
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
import rest_framework.status as status
from rest_framework.decorators import api_view
from user.models import CustomUser
import datetime
from rest_framework.decorators import api_view, permission_classes
from user.models import *
from .pagination import StandardResultsSetPagination

def create_food(request):
    if request.method == 'POST':
        form = FoodForm(request.POST)
        if form.is_valid():
            food = form.save()
            messages.success(request, 'Food item created successfully!')
            return redirect('food_detail', pk=food.pk)
    else:
        form = FoodForm()
    return render(request, 'create_food.html', {'form': form})

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages

@csrf_exempt
def upload_food_csv(request):
    if request.method == 'POST':
        form = FoodCSVForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                csv_file = request.FILES['csv_file']
                import_foods_from_csv(csv_file)
                return JsonResponse({'message': 'Foods imported successfully!'}, status=200)
            except Exception as e:
                return JsonResponse({'error': f'Error importing foods: {str(e)}'}, status=500)
        else:
            return JsonResponse({'error': 'Invalid form data'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)



def food_detail(request, pk):
    food = get_object_or_404(Food, pk=pk)
    return render(request, 'food_detail.html', {'food': food})

def food_list(request):
    f = FoodFilter(request.GET, queryset=Food.objects.all())
    return render(request, 'food_list.html', {'filter': f})

class FoodViewSet(viewsets.ModelViewSet):
    queryset = Food.objects.all().order_by('name')
    serializer_class = FoodSerializer
    
from rest_framework.decorators import action
    
class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', None)
        if query:
            ingredients = self.queryset.filter(name__icontains=query)
        else:
            ingredients = self.queryset.all()
        serializer = self.get_serializer(ingredients, many=True)
        return Response(serializer.data)
    
from django_filters.rest_framework import DjangoFilterBackend
    
class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all().prefetch_related('ingredients__food')
    serializer_class = DishSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = (DjangoFilterBackend,)
    filterset_class = DishFilter
    
class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all().prefetch_related('dishes__ingredients__food', 'dishes')
    serializer_class = MealSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = (DjangoFilterBackend,)
    filterset_class = MealFilter

class DailyDietViewSet(viewsets.ModelViewSet):
    queryset = DailyDiet.objects.all()
    serializer_class = DailyDietSerializer
    
class DietViewSet(viewsets.ModelViewSet):
    queryset = Diet.objects.all()
    serializer_class = DietSerializer
    
class TodayDailyDietView(APIView):
    def get(self, request, *args, **kwargs):
        today = timezone.now().date()
        user = request.user
        
        # Filtra las Dietas por el usuario logueado
        diets = Diet.objects.filter(user=user)
        
        # Encuentra las DailyDiet dentro del rango de fechas de las Dietas filtradas que coincidan con 'hoy'
        today_diets = DailyDiet.objects.filter(diet__in=diets, date=today)
        
        # Serializa y devuelve los resultados
        serializer = DailyDietSerializer(today_diets, many=True)
        return Response(serializer.data)
    
class DailyDietByDateView(APIView):
    def get(self, request, date, *args, **kwargs):
        # Convierte la cadena de fecha en un objeto de fecha
        date = timezone.datetime.strptime(date, '%Y-%m-%d').date()
        user = request.user
        
        diets = Diet.objects.filter(user=user)
        daily_diets = DailyDiet.objects.filter(diet__in=diets, date=date)
        
        serializer = DailyDietSerializer(daily_diets, many=True)
        return Response(serializer.data)
    
from django_filters import rest_framework as filters

class DayOptionViewSet(viewsets.ModelViewSet):
    queryset = DayOption.objects.all().prefetch_related(
        'breakfast__dishes__ingredients__food', 
        'mid_morning__dishes__ingredients__food', 
        'lunch__dishes__ingredients__food', 
        'snack__dishes__ingredients__food', 
        'dinner__dishes__ingredients__food', 
        'extras__dishes__ingredients__food'
    )
    serializer_class = DayOptionSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = DayOptionFilter
    
class WeekOptionViewSet(viewsets.ModelViewSet):
    queryset = WeekOption.objects.all().prefetch_related(
        'monday_option__breakfast__dishes__ingredients__food',
        'monday_option__mid_morning__dishes__ingredients__food',
        'monday_option__lunch__dishes__ingredients__food',
        'monday_option__snack__dishes__ingredients__food',
        'monday_option__dinner__dishes__ingredients__food',
        'monday_option__extras__dishes__ingredients__food',
        'tuesday_option__breakfast__dishes__ingredients__food',
        'tuesday_option__mid_morning__dishes__ingredients__food',
        'tuesday_option__lunch__dishes__ingredients__food',
        'tuesday_option__snack__dishes__ingredients__food',
        'tuesday_option__dinner__dishes__ingredients__food',
        'tuesday_option__extras__dishes__ingredients__food',
        'wednesday_option__breakfast__dishes__ingredients__food',
        'wednesday_option__mid_morning__dishes__ingredients__food',
        'wednesday_option__lunch__dishes__ingredients__food',
        'wednesday_option__snack__dishes__ingredients__food',
        'wednesday_option__dinner__dishes__ingredients__food',
        'wednesday_option__extras__dishes__ingredients__food',
        'thursday_option__breakfast__dishes__ingredients__food',
        'thursday_option__mid_morning__dishes__ingredients__food',
        'thursday_option__lunch__dishes__ingredients__food',
        'thursday_option__snack__dishes__ingredients__food',
        'thursday_option__dinner__dishes__ingredients__food',
        'thursday_option__extras__dishes__ingredients__food',
        'friday_option__breakfast__dishes__ingredients__food',
        'friday_option__mid_morning__dishes__ingredients__food',
        'friday_option__lunch__dishes__ingredients__food',
        'friday_option__snack__dishes__ingredients__food',
        'friday_option__dinner__dishes__ingredients__food',
        'friday_option__extras__dishes__ingredients__food',
        'saturday_option__breakfast__dishes__ingredients__food',
        'saturday_option__mid_morning__dishes__ingredients__food',
        'saturday_option__lunch__dishes__ingredients__food',
        'saturday_option__snack__dishes__ingredients__food',
        'saturday_option__dinner__dishes__ingredients__food',
        'saturday_option__extras__dishes__ingredients__food',
        'sunday_option__breakfast__dishes__ingredients__food',
        'sunday_option__mid_morning__dishes__ingredients__food',
        'sunday_option__lunch__dishes__ingredients__food',
        'sunday_option__snack__dishes__ingredients__food',
        'sunday_option__dinner__dishes__ingredients__food',
        'sunday_option__extras__dishes__ingredients__food'
    )
    serializer_class = WeekOptionSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = WeekOptionFilter
    
class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    
class AssignedOptionViewSet(viewsets.ModelViewSet):
    queryset = AssignedOption.objects.all()
    serializer_class = AssignedOptionSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.is_trainer:
                return Response({"error": "Solo los entrenadores pueden crear asignaciones."}, status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        # Validar que la opción de día exista
        for key, value in request.data.items():
            if key.endswith('_option') and value is not None:
                try:
                    DayOption.objects.get(pk=value)
                except DayOption.DoesNotExist:
                    return Response({key: [f"Clave primaria \"{value}\" inválida - objeto no existe."]}, status=status.HTTP_400_BAD_REQUEST)
        self.perform_update(serializer)
        return Response(serializer.data)

from django.utils.dateparse import parse_date
        
@api_view(['POST'])
def assignOption(request):
    if not request.user.is_trainer:
        return Response({"error": "Solo los entrenadores pueden crear asignaciones."}, status=status.HTTP_403_FORBIDDEN)
    
    user_id = request.data.get('userId')
    option_id = request.data.get('optionId')
    start_date = request.data.get('startDate')  # Obtener la fecha de inicio desde la solicitud

    user = get_object_or_404(CustomUser, id=user_id)
    option = get_object_or_404(Option, id=option_id)

    # Asegurarse de que start_date sea un objeto de fecha
    start_date = parse_date(start_date) if start_date else timezone.now().date()

    assignment = AssignedOption.objects.create(
        user=user,
        option=option,
        start_date=start_date
    )

    # Generar el URL del PDF si es necesario
    pdf_url = f'/media/pdfs/{option.name}.pdf'
    assignment.pdf_url = pdf_url
    assignment.save()

    return Response({
        "message": "Option assigned successfully",
        "assignedOptionId": assignment.id,  # ID de la asignación
        "optionId": option.id,
        "startDate": assignment.start_date.strftime("%Y-%m-%d"),
        "pdfUrl": pdf_url
    }, status=status.HTTP_201_CREATED)
    
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from django.http import HttpResponse
from io import BytesIO
from .models import Option
import os
from django.conf import settings
from django.http import Http404
from reportlab.platypus import Image
from reportlab.pdfgen import canvas
from reportlab.platypus.flowables import KeepTogether

class BackgroundCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        self.background_image_path = kwargs.pop('background_image_path', None)
        super().__init__(*args, **kwargs)

    def draw_background(self):
        if self.background_image_path:
            page_width, page_height = self._pagesize
            self.drawImage(self.background_image_path, 0, 0, width=page_width, height=page_height)

    def showPage(self):
        self.draw_background()
        super().showPage()

    def save(self):
        self.draw_background()
        super().save()

def generate_option_pdf(request, option_id):
    try:
        option = Option.objects.get(id=option_id)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{option.name}.pdf"'

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=landscape(letter), rightMargin=10, leftMargin=10, topMargin=10, bottomMargin=10)
        elements = []
        styles = getSampleStyleSheet()

        days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        day_attrs = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        meals = ['Desayuno', 'Media Mañana', 'Almuerzo', 'Merienda', 'Cena']
        meal_attrs = ['breakfast', 'mid_morning', 'lunch', 'snack', 'dinner']

        option_titles = ['Opción A', 'Opción B', 'Opción C']

        for day, day_attr in zip(days, day_attrs):
            elements.append(Spacer(1, 6))
            day_header = Paragraph(day, styles['Title'])
            day_header_style = styles['Title']
            day_header_style.fontSize = 14
            day_header_style.spaceAfter = 6
            elements.append(day_header)

            table_data = [['Comida'] + option_titles]

            for meal_name, meal_attr in zip(meals, meal_attrs):
                meal_row = [Paragraph(meal_name, styles['Heading3'])]
                for i in range(1, 4):
                    week_option = getattr(option, f'week_option_{["one", "two", "three"][i-1]}')
                    day_option = getattr(week_option, f'{day_attr}_option')
                    meal = getattr(day_option, meal_attr)
                    ingredients_paragraph = generate_meal_data(meal, styles)
                    meal_row.append(Paragraph(ingredients_paragraph, styles['BodyText']))
                table_data.append(meal_row)

            t = Table(table_data)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('BOX', (0,0), (-1,-1), 2, colors.black),
                ('GRID', (0,0), (-1,-1), 1, colors.black),
                ('BACKGROUND', (1, 0), (1, -1), colors.lightblue),
                ('BACKGROUND', (2, 0), (2, -1), colors.lightgreen),
                ('BACKGROUND', (3, 0), (3, -1), colors.lightgrey),
            ]))
            elements.append(t)
            elements.append(PageBreak())

        doc.build(elements)
        pdf = buffer.getvalue()
        buffer.close()

        pdf_dir = os.path.join(settings.MEDIA_ROOT, 'pdfs')
        if not os.path.exists(pdf_dir):
            os.makedirs(pdf_dir)
        pdf_path = os.path.join(pdf_dir, f"{option.name}.pdf")

        with open(pdf_path, 'wb') as f:
            f.write(pdf)

        response.write(pdf)
        return response

    except Option.DoesNotExist:
        raise Http404("La opción no existe.")

def generate_meal_data(meal, styles):
    ingredients_text = []
    for meal_dish in meal.mealdish_set.all():
        dish = meal_dish.dish
        portion = meal_dish.portion
        ingredients = dish.dishingredient_set.all()
        dish_text = f'<b>{dish.name}</b>: ' + ', '.join(f"{di.ingredient.food.name} ({portion} porciones)" for di in ingredients)
        ingredients_text.append(dish_text)
    return '<br/>'.join(ingredients_text)

@api_view(['GET'])
def assigned_options(request):
    if not request.user.is_regular_user:
        return Response({"error": "Solo los usuarios regulares pueden ver las opciones asignadas."}, status=status.HTTP_403_FORBIDDEN)

    today = timezone.now().date()
    assigned_options = AssignedOption.objects.filter(user=request.user, start_date__lte=today).order_by('-start_date')
    serializer = AssignedOptionSerializer(assigned_options, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

from decimal import Decimal, ROUND_HALF_UP
from django.db import transaction

import logging

# Configura el logger
logger = logging.getLogger(__name__)

def calculate_bmr(user):
    try:
        latest_measurement = RegularUserMeasurement.objects.filter(user=user).order_by('-date').first()

        if not latest_measurement:
            raise ValueError("No measurements found for user")

        weight = Decimal(latest_measurement.weight)
        height = Decimal(latest_measurement.height)
        age = Decimal(user.profile.age)
        gender = user.profile.gender

        if weight is None or height is None or age is None:
            raise ValueError("Weight, height, or age is None")

        if gender == 'male':
            return weight * Decimal(10) + height * Decimal(6.25) - age * Decimal(5) + Decimal(5)
        else:
            return weight * Decimal(10) + height * Decimal(6.25) - age * Decimal(5) - Decimal(161)
    except Exception as e:
        logger.error(f"Error calculating BMR: {e}")
        raise

def calculate_daily_caloric_needs(user):
    bmr = calculate_bmr(user)
    activity_factor = Decimal(1.55)  # Assuming moderate activity level
    return bmr * activity_factor

@transaction.atomic
def adapt_meal(original_meal, scale_factor):
    new_meal = Meal.objects.create(
        name=f"{original_meal.name} - adapted",
        user=original_meal.user
    )

    MIN_PORTION = Decimal('0.25')

    for meal_dish in original_meal.mealdish_set.all():
        original_portion = Decimal(meal_dish.portion)
        
        if original_portion == 0:
            original_portion = Decimal('1.00')

        new_portion = (original_portion * Decimal(scale_factor)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        
        if new_portion < MIN_PORTION:
            new_portion = MIN_PORTION

        MealDish.objects.create(
            meal=new_meal,
            dish=meal_dish.dish,
            portion=new_portion,
            notes=meal_dish.notes
        )

    return new_meal

@transaction.atomic
def adapt_day_option(original_day_option, scale_factor, trainer):
    new_day_option = DayOption.objects.create(
        name=f"{original_day_option.name} - adapted",
        trainer=trainer,
        breakfast=adapt_meal(original_day_option.breakfast, scale_factor),
        mid_morning=adapt_meal(original_day_option.mid_morning, scale_factor),
        lunch=adapt_meal(original_day_option.lunch, scale_factor),
        snack=adapt_meal(original_day_option.snack, scale_factor),
        dinner=adapt_meal(original_day_option.dinner, scale_factor),
    )

    new_day_option.extras.set([adapt_meal(extra, scale_factor) for extra in original_day_option.extras.all()])
    new_day_option.save()

    # Logging the new day option details
    print(f"New Day Option: {new_day_option.name}, Trainer: {new_day_option.trainer.username}")
    print(f"  Breakfast: {new_day_option.breakfast.name}")
    print(f"  Mid Morning: {new_day_option.mid_morning.name}")
    print(f"  Lunch: {new_day_option.lunch.name}")
    print(f"  Snack: {new_day_option.snack.name}")
    print(f"  Dinner: {new_day_option.dinner.name}")
    print(f"  Extras: {[meal.name for meal in new_day_option.extras.all()]}")

    return new_day_option

@transaction.atomic
def adapt_week_option(original_week_option, user, trainer):
    user_calories = calculate_daily_caloric_needs(user)
    total_calories = sum(Decimal(getattr(original_week_option, f"{day}_option").calories) for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    scale_factor = Decimal(user_calories) / total_calories

    # Log the calculated values
    print(f"User Calories: {user_calories}, Total Calories: {total_calories}, Scale Factor: {scale_factor}")

    new_week_option = WeekOption.objects.create(
        name=f"{original_week_option.name} - adapted",
        trainer=trainer,
        monday_option=adapt_day_option(original_week_option.monday_option, scale_factor, trainer),
        tuesday_option=adapt_day_option(original_week_option.tuesday_option, scale_factor, trainer),
        wednesday_option=adapt_day_option(original_week_option.wednesday_option, scale_factor, trainer),
        thursday_option=adapt_day_option(original_week_option.thursday_option, scale_factor, trainer),
        friday_option=adapt_day_option(original_week_option.friday_option, scale_factor, trainer),
        saturday_option=adapt_day_option(original_week_option.saturday_option, scale_factor, trainer),
        sunday_option=adapt_day_option(original_week_option.sunday_option, scale_factor, trainer),
    )

    # Logging the new week option details
    print(f"New Week Option: {new_week_option.name}, Trainer: {new_week_option.trainer.username}")
    print(f"  Monday Option: {new_week_option.monday_option.name}")
    print(f"  Tuesday Option: {new_week_option.tuesday_option.name}")
    print(f"  Wednesday Option: {new_week_option.wednesday_option.name}")
    print(f"  Thursday Option: {new_week_option.thursday_option.name}")
    print(f"  Friday Option: {new_week_option.friday_option.name}")
    print(f"  Saturday Option: {new_week_option.saturday_option.name}")
    print(f"  Sunday Option: {new_week_option.sunday_option.name}")

    return new_week_option

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def adapt_option_to_user_view(request):
    new_option_name = request.data.get('new_option_name')
    option_id = request.data.get('option_id')
    user_id = request.data.get('user_id')

    try:
        original_option = Option.objects.get(id=option_id)
        user = RegularUser.objects.get(id=user_id)
        trainer = request.user.trainer

        # Adapt the WeekOptions and create new ones
        new_week_options = []
        for week_option_field in ['week_option_one', 'week_option_two', 'week_option_three']:
            week_option = getattr(original_option, week_option_field)
            if week_option:
                new_week_option = adapt_week_option(week_option, user, trainer)
                new_week_option.name = f"{new_option_name} - {week_option_field}"
                new_week_option.save()
                new_week_options.append(new_week_option)

        # Create new Option with adapted WeekOptions
        new_option = Option.objects.create(
            name=new_option_name,
            trainer=trainer,
            week_option_one=new_week_options[0] if len(new_week_options) > 0 else None,
            week_option_two=new_week_options[1] if len(new_week_options) > 1 else None,
            week_option_three=new_week_options[2] if len(new_week_options) > 2 else None
        )

        # Logging the new option details
        print(f"New Option Created: {new_option.name}, Trainer: {new_option.trainer.username}")
        print(f"  Week Option One: {new_option.week_option_one.name if new_option.week_option_one else 'None'}")
        print(f"  Week Option Two: {new_option.week_option_two.name if new_option.week_option_two else 'None'}")
        print(f"  Week Option Three: {new_option.week_option_three.name if new_option.week_option_three else 'None'}")

        adapted_option_data = OptionSerializer(new_option).data
        return Response(adapted_option_data, status=status.HTTP_200_OK)
    except Option.DoesNotExist:
        return Response({"error": "Option not found"}, status=status.HTTP_404_NOT_FOUND)
    except RegularUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_assigned_options(request, client_id):
    assigned_options = AssignedOption.objects.filter(user_id=client_id)
    serializer = AssignedOptionSerializer(assigned_options, many=True)
    return Response(serializer.data)

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated]

    # Listar planes de un usuario
    @action(detail=False, methods=['get'], url_path='user-plans/(?P<user_id>\d+)')
    def user_plans(self, request, user_id=None):
        plans = Plan.objects.filter(user_id=user_id)
        if not plans:
            return Response({"detail": "No se encontraron planes para este usuario."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(plans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Actualizar parcialmente un plan
    def update(self, request, *args, **kwargs):
        plan = self.get_object()
        serializer = self.get_serializer(plan, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Crear un plan con validaciones adicionales (opcional)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plan = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Acción personalizada: Ejemplo para duplicar un plan
    @action(detail=True, methods=['post'], url_path='duplicate')
    def duplicate_plan(self, request, pk=None):
        try:
            original_plan = self.get_object()
            duplicate_plan = Plan.objects.create(
                name=f"{original_plan.name} (Duplicado)",
                user=original_plan.user,
                start_date=original_plan.start_date,
                end_date=original_plan.end_date
            )
            # Si hay relaciones, deberás copiarlas manualmente
            return Response({"detail": "Plan duplicado exitosamente.", "id": duplicate_plan.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomMealViewSet(viewsets.ModelViewSet):
    queryset = CustomMeal.objects.all()
    serializer_class = CustomMealSerializer

class CustomMealIngredientViewSet(viewsets.ModelViewSet):
    queryset = CustomMealIngredient.objects.all()
    serializer_class = CustomMealIngredientSerializer

from django.http import JsonResponse
import json
@csrf_exempt
def save_plan(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user')
            plan_name = data.get('planId')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            meals_data = data.get('ingredients', {})

            # Validar la información
            if not user_id or not plan_name or not start_date or not end_date:
                return JsonResponse({'error': 'Faltan datos obligatorios'}, status=400)

            # Obtener el usuario
            user = CustomUser.objects.get(id=user_id)

            # Crear el plan
            plan = Plan.objects.create(
                name=plan_name,
                user=user,
                start_date=parse_date(start_date),
                end_date=parse_date(end_date)
            )

            # Crear las comidas personalizadas y sus ingredientes
            for day, meals in meals_data.items():
                for meal_num, ingredients in meals.items():
                    custom_meal = CustomMeal.objects.create(
                        plan=plan,
                        meal_number=meal_num,
                        name=f"{day} - Meal {meal_num}"
                    )
                    for ingredient_data in ingredients:
                        ingredient = Ingredient.objects.get(id=ingredient_data['id'])
                        CustomMealIngredient.objects.create(
                            custom_meal=custom_meal,
                            ingredient=ingredient,
                            quantity=ingredient_data['quantity'],
                            unit_based=ingredient_data.get('unit_based', False)
                        )

            return JsonResponse({'message': 'Plan guardado exitosamente'}, status=200)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)
