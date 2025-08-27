from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO
from django.http import HttpResponse
from .models import ComparativePlanTable, ComparativePlan, ComparativeMeal, ComparativeMealIngredient
from user.models import RegularUser

class NutritionPlanPDFService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Configura estilos personalizados para el PDF"""
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=18,
            spaceAfter=20,
            alignment=TA_CENTER,
            textColor=colors.darkgreen
        )
        
        self.subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=15,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        )
        
        self.header_style = ParagraphStyle(
            'CustomHeader',
            parent=self.styles['Heading3'],
            fontSize=12,
            spaceAfter=10,
            textColor=colors.darkgreen
        )
    
    def generate_plan_pdf(self, table_id):
        """Genera un PDF del plan de comida comparativo"""
        try:
            # Obtener datos del plan
            table = ComparativePlanTable.objects.get(id=table_id)
            plans = ComparativePlan.objects.filter(table=table).order_by('order')
            
            # Crear buffer para el PDF
            buffer = BytesIO()
            
            # Crear documento en orientación horizontal para mejor visualización
            doc = SimpleDocTemplate(buffer, pagesize=landscape(A4))
            story = []
            
            # Título principal
            title = Paragraph(f"Plan de Comida: {table.name}", self.title_style)
            story.append(title)
            
            # Información del usuario
            if table.user:
                user_info = Paragraph(f"Cliente: {table.user.user.username}", self.subtitle_style)
                story.append(user_info)
            
            # Fecha de creación
            creation_date = Paragraph(f"Fecha de creación: {table.created_at.strftime('%d/%m/%Y')}", self.subtitle_style)
            story.append(creation_date)
            
            story.append(Spacer(1, 20))
            
            # Generar tabla de comidas
            meals_table = self.create_meals_table(plans)
            story.append(meals_table)
            
            story.append(Spacer(1, 20))
            
            # Generar tabla de macros
            macros_table = self.create_macros_table(plans)
            story.append(macros_table)
            
            # Construir PDF
            doc.build(story)
            
            # Obtener valor del buffer
            pdf = buffer.getvalue()
            buffer.close()
            
            return pdf
            
        except Exception as e:
            print(f"Error generando PDF: {e}")
            return None
    
    def create_meals_table(self, plans):
        """Crea la tabla principal de comidas"""
        # Obtener todas las comidas únicas
        all_meals = ComparativeMeal.objects.filter(plan__in=plans).order_by('meal_number').distinct()
        
        # Crear encabezados
        headers = ['Comida']
        for plan in plans:
            headers.append(f'{plan.name}')
        
        # Crear filas de datos
        table_data = [headers]
        
        for meal in all_meals:
            row = [meal.name]
            
            for plan in plans:
                try:
                    plan_meal = ComparativeMeal.objects.get(plan=plan, meal_number=meal.meal_number)
                    ingredients = ComparativeMealIngredient.objects.filter(meal=plan_meal)
                    
                    if ingredients.exists():
                        ingredient_text = []
                        for ing in ingredients:
                            ingredient_text.append(f"• {ing.ingredient.name} ({ing.quantity} {ing.unit})")
                        
                        row.append('\n'.join(ingredient_text))
                    else:
                        row.append('Sin ingredientes')
                        
                except ComparativeMeal.DoesNotExist:
                    row.append('No disponible')
            
            table_data.append(row)
        
        # Crear tabla
        table = Table(table_data, colWidths=[1.5*inch] + [2.5*inch] * len(plans))
        
        # Estilo de la tabla
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkgreen),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ])
        
        table.setStyle(style)
        return table
    
    def create_macros_table(self, plans):
        """Crea la tabla de macros nutricionales"""
        # Encabezados
        headers = ['Plan', 'Calorías', 'Proteínas (g)', 'Grasas (g)', 'Carbohidratos (g)']
        
        # Datos
        table_data = [headers]
        
        for plan in plans:
            total_calories = 0
            total_protein = 0
            total_fat = 0
            total_carbs = 0
            
            meals = ComparativeMeal.objects.filter(plan=plan)
            for meal in meals:
                ingredients = ComparativeMealIngredient.objects.filter(meal=meal)
                for ingredient in ingredients:
                    if ingredient.calories:
                        total_calories += ingredient.calories
                    if ingredient.protein:
                        total_protein += ingredient.protein
                    if ingredient.fat:
                        total_fat += ingredient.fat
                    if ingredient.carbohydrates:
                        total_carbs += ingredient.carbohydrates
            
            row = [
                plan.name,
                f"{total_calories:.1f}",
                f"{total_protein:.1f}",
                f"{total_fat:.1f}",
                f"{total_carbs:.1f}"
            ]
            table_data.append(row)
        
        # Crear tabla
        table = Table(table_data, colWidths=[1.5*inch, 1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch])
        
        # Estilo de la tabla
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lightblue),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ])
        
        table.setStyle(style)
        return table
