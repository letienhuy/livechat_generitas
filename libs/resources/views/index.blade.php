@extends('layouts.app')

@section('content')
    <section id="content">
        <div class="login dialog">
            <div class="login-control">
                <form action="{{route('login')}}" id="form-login">
                    @csrf
                    <button class="btn btn-fb d-block m-auto"><i class="fa fa-facebook"></i> Đăng nhập bằng Facebook</button>
                </form>
            </div>
            <div class="login-control text-center mg-top-10">
                <label class="cs-checkbox pull-left mg-left-10">
                    <input type="checkbox" id="chk-login">
                    <span class="cs-checkbox_check"></span>
                </label>
                <span class="d-block" id="term-login">Tôi đồng ý với các <a href="{{ url('tos') }}">điều khoản dịch vụ</a> và <a href="{{ url('privacy') }}">chính sách bảo mật</a> của <a href="http://generitas.vn">GeniX</a></span>
            </div>
            <br>
            <p style="text-align: center">
                Chúng tôi cần một số quyền quản lý tin nhắn trên trang của bạn để có thể trả lời tự động. Sau khi cấp quyền bạn sẽ được chuyển hướng lại đây để có thể sử dụng toàn bộ tính năng của trang
            </p>
        </div>
    </section>
@endsection
