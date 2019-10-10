<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">

    <title><?php echo e(config('app.name')); ?></title>

    <!-- Scripts -->
    <script type="text/javascript">
        const baseURL = "<?php echo e(url('')); ?>";
        <?php if(isset($page)): ?>
            const PAGE_ID =  "<?php echo e($page->page_id); ?>";
            const ACCOUNT_ID =  "fb<?php echo e($page->page_id); ?>";
        <?php endif; ?>
    </script>

<link rel="stylesheet" href="<?php echo e(asset('css/font-awesome.min.css')); ?>">
<link rel="stylesheet" href="<?php echo e(asset('css/bootstrap.min.css')); ?>">
<link rel="stylesheet" href="<?php echo e(asset('css/simplebar.css')); ?>" />
<link href="<?php echo e(asset('css/icon.css')); ?>" rel="stylesheet">
<link href="<?php echo e(asset('css/app.css')); ?>" rel="stylesheet">
<script src="<?php echo e(asset('js/app.js')); ?>"></script>
<script src="<?php echo e(asset('js/jquery-ui.min.js')); ?>"></script>
</head>
<body>
    <div id="root">
        <header>
            <nav class="header">
                <button class="header-toggler">
                    <i class="fa fa-bars"></i>
                </button>
                <div class="header-collapse">
                    <?php if(auth()->guard()->check()): ?>
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
                    <?php endif; ?>
                </div>
            </nav>
        </header>
        <div id="body">
            <div id="container">
                <?php echo $__env->yieldContent('content'); ?>
            </div>
        </div>
    </div> 
</body>
</html>
