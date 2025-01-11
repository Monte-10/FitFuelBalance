from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'foods', views.FoodViewSet)
router.register(r'ingredients', views.IngredientViewSet)
router.register(r'dishes', views.DishViewSet)
router.register(r'meals', views.MealViewSet)
router.register(r'daily_diets', views.DailyDietViewSet)
router.register(r'diet', views.DietViewSet)
router.register(r'dayoptions', views.DayOptionViewSet)
router.register(r'weekoptions', views.WeekOptionViewSet)
router.register(r'options', views.OptionViewSet)
router.register(r'assignedoptions', views.AssignedOptionViewSet)
router.register(r'plans', views.PlanViewSet)  # <-- PlanViewSet con create/update
router.register(r'custom_meals', views.CustomMealViewSet)
router.register(r'custom_meal_ingredients', views.CustomMealIngredientViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('food_create/', views.create_food, name='create_food'),
    path('food_upload/', views.upload_food_csv, name='upload_food_csv'),
    path('food_detail/<int:pk>/', views.food_detail, name='food_detail'),
    path('food_list/', views.food_list, name='food_list'),
    path('dailydiets/today', views.TodayDailyDietView.as_view(), name='today-dailydiets'),
    path('dailydiets/date/<str:date>', views.DailyDietByDateView.as_view(), name='dailydiet-by-date'),
    path('assignOption/', views.assignOption, name='assignOption'),
    path('options/<int:option_id>/pdf/', views.generate_option_pdf, name='generate_option_pdf'),
    path('assigned-options/', views.assigned_options, name='assigned_options'),
    path('adapt-option/', views.adapt_option_to_user_view, name='adapt_option_to_user'),
    path('assignedoptions/client/<int:client_id>/', views.get_assigned_options, name='get_assigned_options'),
    path('plans/save/', views.save_plan, name='save_plan'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
