<section id="sidebar">
    <div class="logo">
        <div class="logo-border">
            <img src="<?php echo e(asset('images/logo.png')); ?>" alt="GENERITAS">
        </div>
    </div>
    <div class="sidebar-bot">
        <div class="sidebar-bot_picture pull-left">
            <img src="<?php echo e($page->picture); ?>" alt="">
        </div>
        <p><?php echo e($page->name); ?></p>
        <div class="sidebar-bot-caret"></div>
    </div>
    <div class="sidebar-bot-menu" data-simplebar>
        <?php $__currentLoopData = $subscribedPages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php if($item->page_id == $page->page_id): ?>
                <?php continue; ?>
            <?php endif; ?>
            <div class="sidebar-bot-item">
                <div class="sidebar-bot-item_picture pull-left">
                    <img src="<?php echo e($item->picture); ?>" alt="">
                </div>
                <p><a href="<?php echo e(route('account.chat.home', ['pageId' => $item->page_id])); ?>"><?php echo e($item->name); ?></a></p>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        <div class="sidebar-bot-item">
            <div class="sidebar-bot-item_picture pull-left">
                <i class="fa fa-plus"></i>
            </div>
            <p>
                <a href="<?php echo e(route('account.add')); ?>">Thêm trang</a>
            </p>
        </div>
    </div>
    <div class="sidebar-list" data-simplebar>
        <div class="sidebar-list-item <?php echo e($currentRoute == "account.chat.home" ? 'item-selected' : null); ?> font-weight-bold">
            <div class="sidebar-icon">
                <i class="icon-ic-chat"></i>
            </div>
            <a href="<?php echo e(route('account.chat.home', ['pageId' => $page->page_id])); ?>">
                <p>
                    Tin nhắn
                </p>
            </a>
            <div class="sidebar-caret"></div>
        </div>
        <div class="sidebar-list-item <?php echo e($currentRoute == "account.report.home" ? 'item-selected' : null); ?> font-weight-bold">
            <div class="sidebar-icon">
                <i class="icon-ic-report"></i>
            </div>
            <a href="<?php echo e(route('account.report.home', ['pageId' => $page->page_id])); ?>">
                <p>Báo cáo</p>
            </a>
            <div class="sidebar-caret"></div>
        </div>
        <div class="sidebar-list-item font-weight-bold">
            <div class="sidebar-icon">
                <i class="icon-ic-group-user"></i>
            </div>
            <p>Danh sách khách hàng</p>
            <div class="sidebar-caret"></div>
        </div>
        <div class="sidebar-list-item font-weight-bold <?php echo e($currentRoute == "account.broadcast.home" ? 'item-selected' : null); ?>">
            <div class="sidebar-icon">
                <i class="icon-ic-broadcast"></i>
            </div>
            <a href="<?php echo e(route('account.broadcast.home', ['pageId' => $page->page_id])); ?>">
                <p>
                    Gửi tin nhắn
                </p>
            </a>
            <div class="sidebar-caret"></div>
        </div>
        <div class="sidebar-list-item font-weight-bold">
            <div class="sidebar-icon">
                <i class="icon-ic-support"></i>
            </div>
            <p>Kịch bản chăm sóc</p>
            <div class="sidebar-caret"></div>
        </div>
    </div>
</section>
