<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name') }}</title>

    <!-- Scripts -->
    <script type="text/javascript">
        const baseURL = "{{ url('') }}";
        @if (isset($page))
            const PAGE_ID =  "{{$page->page_id}}";
            const ACCOUNT_ID =  "fb{{$page->page_id}}";
        @endif
    </script>

<link rel="stylesheet" href="{{asset('css/font-awesome.min.css')}}">
<link rel="stylesheet" href="{{asset('css/bootstrap.min.css')}}">
<link rel="stylesheet" href="{{ asset('css/simplebar.css') }}" />
<link href="{{ asset('css/icon.css') }}" rel="stylesheet">
<link href="{{ asset('css/app.css') }}" rel="stylesheet">
<script src="{{ asset('js/app.js') }}"></script>
<script src="{{asset('js/jquery-ui.min.js')}}"></script>
</head>
<body>
    <div id="root">
        <header>
            <nav class="header">
                <button class="header-toggler">
                    <i class="fa fa-bars"></i>
                </button>
                <div class="header-collapse">
                    @auth
                        <div class="header-pull-right">
                            <button class="header-btn-icon">
                                <i class="icon-icon-search"></i>
                            </button>
                            <button class="header-btn-icon header-btn-icon_unread" unread="9+">
                                <i class="icon-icon-messenger"></i>
                            </button>
                            <button class="header-btn-icon">
                                <i class="icon-icon-user"></i>
                            </button>
                            <button class="header-btn-icon">
                                <i class="icon-icon-setting"></i>
                            </button>
                        </div>
                    @endauth
                </div>
            </nav>
        </header>
        <div id="body">
            <div id="container">
                @yield('content')
            </div>
        </div>
    </div> 
</body>
</html>
