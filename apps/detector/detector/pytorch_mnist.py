import torch
import torch.nn.functional as F
import torchvision


class MNIST(torch.nn.Module):
    def __init__(self):
        super(MNIST, self).__init__()
        self.conv_1 = torch.nn.Conv2d(in_channels=1, out_channels=8, kernel_size=3, stride=1, padding=1)
        self.max_pool = torch.nn.MaxPool2d(2, stride=2)
        self.conv_2 = torch.nn.Conv2d(in_channels=8, out_channels=16, kernel_size=3, stride=1, padding=1)
        self.fc1 = torch.nn.Linear(in_features=16 * 7 * 7, out_features=128)
        self.fc2 = torch.nn.Linear(in_features=128, out_features=10)

    def forward(self, x):
        out = F.relu(self.conv_1(x))  # convolucional layer 1
        out = self.max_pool(out)
        out = F.relu(self.conv_2(out))  # convolucional layer 2
        out = self.max_pool(out)
        out = out.view(-1, 16 * 7 * 7)
        out = F.relu(self.fc1(out))  # fully connected layer 1
        out = self.fc2(out)  # fully connected layer 2 (without SoftMax)

        return out


transforms = torchvision.transforms.Compose([
    torchvision.transforms.Resize(size=28),
    torchvision.transforms.Grayscale(num_output_channels=1),
    torchvision.transforms.ToTensor()
])
