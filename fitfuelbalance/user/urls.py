from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'regularusers', views.RegularUserViewSet)
router.register(r'trainers', views.TrainerViewSet)
router.register(r'customusers', views.CustomUserViewSet)
router.register(r'specialties', views.SpecialtyView)
router.register(r'measurements', views.RegularUserMeasurementViewSet, basename='measurements')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('frontlogin/', views.LoginView.as_view(), name='frontlogin'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('regularsignup/', views.RegularUserSignUpView.as_view(), name='regularsignup'),
    path('trainersignup/', views.TrainerSignUpView.as_view(), name='trainersignup'),
    path('signup/regularuser/', views.RegularUserSignUpAPIView.as_view(), name='regularuser_signup'),
    path('signup/trainer/', views.TrainerSignUpAPIView.as_view(), name='trainer_signup'),
    path('profile/', views.ProfileView.as_view({'get': 'list', 'put': 'update'}), name='profile'),
    path('profile-info/', views.profile_view, name='profile_view'),
    path('measurements/history/<int:user_id>/', views.RegularUserMeasurementViewSet.as_view({'get': 'history'}), name='measurement-history'),
    path('regularusers/<int:pk>/details/', views.regular_user_details, name='regularuser-details'),
]

urlpatterns += [
    path('trainers/', views.list_trainers, name='list_trainers'),
    path('specialties/', views.list_specialties, name='list_specialties'),
    path('requests/', views.list_requests, name='list_requests'),
    path('manage_request/<int:request_id>/', views.manage_request, name='manage_request'),
    path('search_trainer/', views.search_trainer, name='search_trainer'),
    path('send_request/', views.send_request, name='send_request'),
    path('accept_request/<int:request_id>/', views.accept_request, name='accept_request'),
    path('reject_request/<int:request_id>/', views.reject_request, name='reject_request'),
    path('cancel_request/<int:request_id>/', views.cancel_request, name='cancel_request'),
    path('requests_page/', views.requests, name='requests_page'),
    path('trainers/<int:pk>/clients/', views.TrainerViewSet.as_view({'get': 'clients'}), name='trainer-clients'),
    path('trainers/by_client/', views.TrainerViewSet.as_view({'get': 'by_client'}), name='trainings-by-client'),
    path('handle_request/<int:request_id>/', views.manage_request, name='handle_request'),
    path('trainer/clients/', views.get_trainer_clients, name='trainer_clients'),
    path('remove_trainer/', views.remove_trainer, name='remove_trainer'),
    path('trainer-details/', views.get_trainer_details, name='trainer-details'),
]
