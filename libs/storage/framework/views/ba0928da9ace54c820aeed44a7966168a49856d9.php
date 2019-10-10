

<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('layouts.sidebar', compact('page'), \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path')))->render(); ?>
    <section id="content">
    </section>
    <script src="<?php echo e(asset('js/report.js')); ?>"></script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path')))->render(); ?>