from django.shortcuts import render, redirect
from django.views import View
from .models import Donation, Institution
from django.contrib.auth.models import User

# Create your views here.


class LandingPage(View):
    def get(self, request):
        count_donation = Donation.objects.all().count()
        count_organizations = Donation.objects.values_list('institution', flat=True).distinct('institution').count()
        organizations = Institution.objects.all()
        return render(request, 'index.html',
                      context={
                          'count_donation': count_donation,
                          'count_organizations': count_organizations,
                          'organizations': organizations
                        }
                      )


class AddDonation(View):
    def get(self, request):
        return render(request, 'form.html')


class Login(View):
    def get(self, request):
        return render(request, 'login.html')


class Register(View):
    def get(self, request):
        return render(request, 'register.html')

    def post(self, request):
        first_name = request.POST.get('name')
        last_name = request.POST.get('surname')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        if '@' in email:
            if password == password2:
                if first_name and last_name:
                    check = User.objects.filter(username=email)
                    if check:
                        pass
                    else:
                        User.objects.create_user(username=email, password=password, first_name=first_name, last_name=last_name)
                        return redirect('login')
        return redirect('register')
