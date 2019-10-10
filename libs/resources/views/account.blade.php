@extends('layouts.app')

@section('content')
    <div class="login dialog">
        <h1 class="login-title text-center">Kết nối trang Facebook</h1>
        @if($errors->any())
            <small style="padding: 5px;" class="alert d-block alert-danger text-center">{{$errors->first()}}</small>
        @endif
        <div class="page-list" data-simplebar>
        @foreach ($pages as $page)
            <div class="page-item">
                    <div class="page-image">
                        <img src="{{$page->picture}}">
                    </div>
                    <a class="pull-right btn btn-sm {{$page->subscribed ? 'btn-connected' : 'btn-connect'}}" href="{{$page->subscribed ? route('account.chat.home', ['pageId' => $page->page_id]) : route('account.connect', ['pageId' => $page->page_id])}}">
                        {{$page->subscribed ? 'Đã kết nối' : 'Kết nối'}}
                    </a>
                    <p class="page-name">{{$page->name}}</p>
                </div>
            @endforeach
        </div>
    </div>
@endsection
