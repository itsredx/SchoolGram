from django.shortcuts import render, redirect
from .models import Room, Message
from django.http import HttpResponse, JsonResponse

# Create your views here.
def home(request):
    username = request.user.username
    return render(request, 'study_group/home.html', {
        'username': username,
    })

def room(request, room):
    username = request.user.username #request.GET.get('username')
    room_details = Room.objects.get(name=room)
    return render(request, 'study_group/room.html', {
        'username': username,
        'room': room,
        'room_details': room_details
    })

def checkview(request):
    room = request.POST['room_name']
    username = request.user.username #request.POST['username']

    if Room.objects.filter(name=room).exists():
        return redirect('/'+room+'/?username='+username)
    else:
        new_room = Room.objects.create(name=room)
        new_room.save()
        return redirect('/'+room+'/?username='+username)

def send(request):
    message = request.POST['message']
    user_id = request.user #request.POST['username']
    room_id = request.POST['room_id']
    username = request.user.username #request.

    new_message = Message.objects.create(value=message, user=user_id, room=room_id, username=username)
    new_message.save()
    return HttpResponse('Message sent successfully')

def getMessages(request, room):
    room_details = Room.objects.get(name=room)

    messages = Message.objects.filter(room=room_details.id)
    return JsonResponse({"messages":list(messages.values())})