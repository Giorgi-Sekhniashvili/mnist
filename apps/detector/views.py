import base64
import re
from io import BytesIO

import numpy as np

import torch
import torch.nn.functional as F
from PIL import Image
from django.views.generic import TemplateView
from django.shortcuts import render
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .detector import mnist, mnist_transforms, device


# Create your views here.

class MNISTIndexView(TemplateView):
    template_name = 'detector/index.html'


class MnistPredictionView(APIView):
    parser_classes = [JSONParser, MultiPartParser]

    def post(self, request):
        image_data = request.POST.get('canvasImage')
        image_data = re.sub("^data:image/png;base64,", "", image_data)
        image_data = base64.b64decode(image_data)
        image_data = BytesIO(image_data)
        img = Image.open(image_data)

        img_arr = np.array(img)
        img_arr = img_arr[:, :, 3]

        img = Image.fromarray(img_arr)
        transformed_img = mnist_transforms(img)
        transformed_img.to(device)
        transformed_img = torch.unsqueeze(transformed_img, 0)

        out = mnist(transformed_img)
        out = F.softmax(out, dim=1)
        out = out.detach().tolist()
        data = [{'index': index, 'value': value} for index, value in enumerate(out[0])]

        return Response({'data': data})
