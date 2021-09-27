import torch
from .pytorch_mnist import MNIST, transforms

device = 'cuda' if torch.cuda.is_available() else 'cpu'
mnist = MNIST().to(device).eval()
mnist.load_state_dict(torch.load('media/weights/MNIST_weights.pt'))
mnist_transforms = transforms
