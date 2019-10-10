<section id="sidebar">
    <div class="logo">
        <div class="logo-border">
            <img src="{{ asset('images/logo.png') }}" alt="GENERITAS">
        </div>
    </div>
    <div class="sidebar-bot">
        <div class="sidebar-bot_picture pull-left">
            <img src="{{$page->picture}}" alt="">
        </div>
        <p>{{$page->name}}</p>
        <div class="sidebar-bot-caret"></div>
    </div>
    <div class="sidebar-bot-menu" data-simplebar>
        @foreach ($subscribedPages as $item)
            @if ($item->page_id == $page->page_id)
                @continue
            @endif
            <div class="sidebar-bot-item">
                <div class="sidebar-bot-item_picture pull-left">
                    <img src="{{$item->picture}}" alt="">
                </div>
                <p><a href="{{route('account.chat.home', ['pageId' => $item->page_id])}}">{{$item->name}}</a></p>
            </div>
        @endforeach
        <div class="sidebar-bot-item">
            <div class="sidebar-bot-item_picture pull-left">
                <i class="fa fa-plus"></i>
            </div>
            <p>
                <a href="{{route('account.add')}}">Thêm trang</a>
            </p>
        </div>
    </div>
    <div class="sidebar-list" data-simplebar>
        <div class="sidebar-list-item {{$currentRoute == "account.chat.home" ? 'item-selected' : null}}">
            <div class="sidebar-icon">
                <i class="icon-icon-chat"></i>
            </div>
            <a href="{{route('account.chat.home', ['pageId' => $page->page_id])}}">
                <p>
                    Tin nhắn
                </p>
            </a>
            <div class="sidebar-caret"></div>
        </div>
        <div class="sidebar-list-item {{$currentRoute == "account.report.home" ? 'item-selected' : null}}">
            <div class="sidebar-icon">
                <i class="icon-icon-report"></i>
            </div>
            <a href="{{route('account.report.home', ['pageId' => $page->page_id])}}">
                <p>Báo cáo</p>
            </a>
            <div class="sidebar-caret"></div>
        </div>
        <div class="sidebar-list-item {{$currentRoute == "account.broadcast.home" ? 'item-selected' : null}}">
            <div class="sidebar-icon">
                <i class="icon-icon-broadcast"></i>
            </div>
            <a href="{{route('account.broadcast.home', ['pageId' => $page->page_id])}}">
                <p>
                    Gửi tin nhắn
                </p>
            </a>
            <div class="sidebar-caret"></div>
        </div>
        <div class="sidebar-list-item">
            <div class="sidebar-icon">
                <i class="icon-icon-cskh"></i>
            </div>
            <p>Kịch bản chăm sóc</p>
            <div class="sidebar-caret"></div>
        </div>
    </div>
    <div class="sidebar-list-item logout">
        <div class="sidebar-icon">
            <i class="fa fa-power-off"></i>
        </div>
        <a href="{{ route('logout') }}">
            <p>Thoát</p>
        </a>
    </div>
</section>
