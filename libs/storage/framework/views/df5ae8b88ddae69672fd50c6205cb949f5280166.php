<?php $__env->startSection('content'); ?>
    <section id="content">
        <div class="login dialog">
            <div class="login-control">
                <form action="<?php echo e(route('login')); ?>" id="form-login">
                    <?php echo csrf_field(); ?>
                    <button class="btn btn-fb d-block m-auto"><i class="fa fa-facebook"></i> Đăng nhập bằng Facebook</button>
                </form>
            </div>
            <div class="login-control text-center mg-top-10">
                <label class="cs-checkbox pull-left mg-left-10">
                    <input type="checkbox" id="chk-login">
                    <span class="cs-checkbox_check"></span>
                </label>
                <span class="d-block" id="term-login">Tôi đồng ý với các <a href="">điều khoản</a> và <a href="">quy định</a> của <a href="">Sanopush</a></span>
            </div>
        </div>
    </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), array('__data', '__path')))->render(); ?>