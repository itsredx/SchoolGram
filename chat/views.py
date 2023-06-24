from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
from chat.models import Thread, ChatMessage


@login_required
def messages_page(request):
    threads = Thread.objects.by_user(user=request.user).prefetch_related('chatmessage_thread').order_by('timestamp')
    context = {
        'Threads': threads
    }
    return render(request, 'messages.html', context)

def get_picture_url(request, thread_id):
    #thread_id = request.GET.get(thread_id)  # Assuming you pass the thread ID as a query parameter
    thread = Thread.objects.get(id=thread_id)
    first_person_picture_url = thread.first_person_profile().picture.url
    second_person_picture_url = thread.second_person_profile().picture.url
    first_person_id = thread.first_person.id
    second_person_id = thread.second_person.id
    
    messages = ChatMessage.objects.filter(thread_id=thread_id)

        # Serialize the messages into JSON format
    serialized_messages = serializers.serialize('json', messages)
    
    data = {
        'first_person_picture_url': first_person_picture_url,
        'second_person_picture_url': second_person_picture_url,
        'first_person_id': first_person_id,
        'second_person_id': second_person_id,
        'messages': serialized_messages
    }
    return JsonResponse(data)
