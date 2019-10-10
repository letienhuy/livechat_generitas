@extends('layouts.app')

@section('content')
    @include('layouts.sidebar', compact('page'))
    <section id="content">
    </section>
    <script src="{{ asset('js/report.js') }}"></script>
@endsection