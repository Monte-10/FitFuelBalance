from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import *

router = DefaultRouter()
router.register(r'exercises', views.ExerciseViewSet)
router.register(r'trainings', views.TrainingViewSet)
router.register(r'training_exercises', views.TrainingExerciseViewSet)
router.register(r'week_trainings', views.WeekTrainingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('trainings/today', views.TodayTrainingView.as_view(), name='today-trainings'),
    path('trainings/date/<str:date>', views.TrainingByDateView.as_view(), name='training-by-date'),
    path('assign_week_training/', views.assign_week_training, name='assign_week_training'),
    path('week_training/<int:assigned_week_id>/pdf/', views.generate_week_training_pdf, name='week_training_pdf'),
    path('assigned-week-trainings/', views.assigned_week_trainings_view, name='assigned_week_trainings'),
]