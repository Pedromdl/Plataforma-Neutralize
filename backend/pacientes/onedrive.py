from backend import requests
from django.conf import settings

def get_access_token(code):
    url = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
    data = {
        'client_id': settings.ONEDRIVE_CLIENT_ID,
        'client_secret': settings.ONEDRIVE_CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.ONEDRIVE_REDIRECT_URI,
        'grant_type': 'authorization_code',
    }
    response = requests.post(url, data=data)
    return response.json().get('access_token')

def upload_to_onedrive(access_token, file_path):
    url = "https://graph.microsoft.com/v1.0/me/drive/root:/pacientes.json:/content"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }
    with open(file_path, 'rb') as file:
        response = requests.put(url, headers=headers, data=file)
    return response.json()