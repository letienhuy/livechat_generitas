<?php $__env->startSection('content'); ?>
    <div class="login dialog">
        <h1 class="login-title text-center">Kết nối trang Facebook</h1>
        <?php if($errors->any()): ?>
            <small style="padding: 5px;" class="alert d-block alert-danger text-center"><?php echo e($errors->first()); ?></small>
        <?php endif; ?>
        <div class="page-list" data-simplebar>
        <?php $__currentLoopData = $pages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $page): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="page-item">
                    <div class="page-image">
                        <img src="<?php echo e($page->picture); ?>">
                    </div>
                    <a class="pull-right btn btn-sm <?php echo e($page->subscribed ? 'btn-connected' : 'btn-connect'); ?>" href="<?php echo e($page->subscribed ? route('account.chat.home', ['pageId' => $page->page_id]) : route('account.connect', ['pageId' => $page->page_id])); ?>">
                        <?php echo e($page->subscribed ? 'Đã kết nối' : 'Kết nối'); ?>

                    </a>
                    <p class="page-name"><?php echo e($page->name); ?></p>
                </div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path')))->render(); ?>