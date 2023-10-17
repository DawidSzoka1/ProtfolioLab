"""
URL configuration for ProtfolioLab project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from base import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.LandingPage.as_view(), name="landing-page"),
    path('add/donation/', views.AddDonation.as_view(), name="add-donation"),
    path('login/', views.Login.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(template_name='index.html'), name="logout"),
    path('register/', views.Register.as_view(), name="register"),
]
