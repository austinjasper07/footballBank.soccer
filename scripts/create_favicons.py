from PIL import Image
import os

root = os.path.dirname(os.path.dirname(__file__))
public_dir = os.path.join(root, 'public')
source = os.path.join(public_dir, 'logo', 'logo3.png')

if not os.path.exists(source):
    raise FileNotFoundError(f'Missing source logo: {source}')

img = Image.open(source).convert('RGBA')
img.resize((16, 16), Image.Resampling.LANCZOS).save(os.path.join(public_dir, 'favicon-16x16.png'))
img.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(public_dir, 'favicon-32x32.png'))
img.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(public_dir, 'apple-touch-icon.png'))
img.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(public_dir, 'favicon.ico'))
img.save(os.path.join(public_dir, 'logo.png'))

print('created favicon assets from public/logo/logo3.png')
