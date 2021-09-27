from django.urls import path
from .views import MNISTIndexView, MnistPredictionView

app_name = 'detector'

urlpatterns = [
    path('', MNISTIndexView.as_view(), name='index'),
    path('get_mnist_predictions/', MnistPredictionView.as_view(), name='get_mnist_predictions')
]
