from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.views import View
from .models import Donation, Institution, Category
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.core.paginator import Paginator


# Create your views here.

class UserProfile(View):
    def get(self, request):
        donations = Donation.objects.filter(user=request.user)
        paginator = Paginator(donations, 10)
        page = request.GET.get('page')
        page_obj = paginator.get_page(page)
        return render(request, 'user-profile.html', context={'page_obj': page_obj})


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
        if request.user.is_authenticated:
            categories = Category.objects.all()
            organizations = Institution.objects.all()
            return render(request, 'form.html', context={'categories': categories, 'organizations': organizations})
        return redirect('login')

    def post(self, request):
        categories = list(map(int, request.POST.getlist('categories')))
        categories = Category.objects.filter(id__in=categories)
        quantity = request.POST.get('bags')
        institution = Institution.objects.get(id=int(request.POST.get('organization')[-1]))
        city = request.POST.get('city')
        address = request.POST.get('address')
        postcode = request.POST.get('postcode')
        phone = request.POST.get('phone')
        date = request.POST.get('data')
        time = request.POST.get('time')
        more_info = request.POST.get('more_info')
        don = Donation.objects.create(quantity=int(quantity),
                                      institution=institution,
                                      phone=phone,
                                      city=city,
                                      address=address,
                                      zip_code=postcode,
                                      pick_up_date=date,
                                      pick_up_time=time,
                                      pick_up_comment=more_info,
                                      user=request.user
                                      )
        don.categories.set(categories)
        don.save()
        return redirect('confirm-donation')


class FormConfirm(View):
    def get(self, request):
        return render(request, 'form-confirmation.html')


class Login(View):
    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):
        email = request.POST.get('email')
        password_to_check = request.POST.get('password')
        user = authenticate(request, username=email, password=password_to_check)
        if user is not None:
            login(request, user)
            return redirect('landing-page')
        else:
            if User.objects.filter(username=email).first() is None:
                return redirect('register')
        return redirect('login')


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
                        User.objects.create_user(username=email, password=password, first_name=first_name,
                                                 last_name=last_name)
                        return redirect('login')
        return redirect('register')
