from django.shortcuts import render
from django.views import View
from .models import Donation, Institution


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
