require('./bootstrap');
require('simplebar-react/dist/simplebar-react')

$(document).on('submit', '#form-login', function(e){
    e.preventDefault();
    if(!$('#chk-login').prop('checked')){
        $('#term-login').animate({
            color: '#f00'
        }, 200);
    }else{
        this.submit();
    }
});
var isToggleSlide = false, currentWidth;
$(document).on('click', '.header-toggler', function(){
    $('#sidebar').toggle();
})

$(document).on('click', '.message-image', function(){
    $(this).remove();
})
$(document).on('click', '.select-drop', function(){
    var target = this.getAttribute('data-target-id');
    if($(target).css('display') == 'none'){
        $('.select-drop_menu').hide();
    }
    $(target).toggle();
});
$(document).on('click', '.select-drop_menu li', function(){
    const id = $(this).parent().attr('id');
    $('[data-target-id="#'+id+'"]').text($(this).text());
    $(this).parent().toggle();
});

$(document).on('click', '.sidebar-bot', function(){
    $(this).toggleClass('bot-selected');
    $('.sidebar-bot-menu').toggleClass('bot-menu-opened');
});

$(document).on('click', '.select-box span', function(){
    $(this).parent().toggleClass('selected');
});
$(document).on('mouseup', function(e){
    var selectBox = $('.select-box span');
    var selectBoxMenuItem = $('.select-box-menu li');
    if(!selectBox.is(e.target)){
        selectBox.parent().removeClass('selected');
    }
    if(selectBoxMenuItem.is(e.target)){
        selectBoxMenuItem.parent().parent().removeClass('selected');
    }
});
$(document).on('click', '.select-box-menu li', function(){
    $(this).parent().parent().children('span').html(this.innerText);
});
$(document).on('click', '.tab-head span', function(){
    window.dispatchEvent(new Event('resize'));
    if($(this).hasClass('active')) return false;
    var tabHeadActive = $(this).parent().children('span.active');
    var tabBodyActive = $(this).parent().parent().find('.tab-body-container.active');
    tabHeadActive.removeClass('active');
    tabBodyActive.removeClass('active');
    $(this).addClass('active');
    $($(this).data('target')).addClass('active');
});
