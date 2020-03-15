(function ($) {
    "use strict";

    
    $(document).ready(function(){

        //show/hide menu when scroll
        $(window).scroll(function () {
            if ($(window).scrollTop() > 130)
                $('div.fix-main-nav').addClass('fix-main-nav-show');
            else
                $('div.fix-main-nav').removeClass('fix-main-nav-show');
        })


        //toggle menu
        $('#toggle-menu-icon').click(function(){
            if ($('.main-nav-wrapper').hasClass('dis-show'))
                $('.main-nav-wrapper').removeClass('dis-show')
            else
                $('.main-nav-wrapper').addClass('dis-show')
        })

        //back to top
        $(window).scroll(function () {
            if ($(window).scrollTop() > 1000)
                $('.back-to-top').addClass('dis-show');
            else
                $('.back-to-top').removeClass('dis-show');
        })

        $('.back-to-top i').click( ()=>{
            $('html, body').animate({scrollTop: 0}, 600);
        })

        //arrow click in content 6 
        let indexOfItemInContent6 = 0;
        $('.arrow-next').click(()=>{
            let activeItem = $('.content6-content div .active');
            //const numberOfChildren = $('.content6-content > div').children().length;
            const width = $('.content6-content').width();

            if (activeItem.is('#last-content6-content')){
                activeItem.removeClass('active');
                $('#first-content6-content').addClass('active');
                indexOfItemInContent6 = 0;

            }else{
                activeItem.next().addClass('active');
                activeItem.removeClass('active');
                indexOfItemInContent6++;
            }
            const offset = -width * indexOfItemInContent6;
            $('.content6-content > div').css('transform', 'translateX(' + offset + 'px)');
            
        })

        $('.arrow-pre').click(()=>{
            let activeItem = $('.content6-content div .active');
            const numberOfChildren = $('.content6-content > div').children().length;
            const width = $('.content6-content').width();

            if (activeItem.is('#first-content6-content')){
                activeItem.removeClass('active');
                $('#last-content6-content').addClass('active');
                indexOfItemInContent6 = numberOfChildren-1;

            }else{
                activeItem.prev().addClass('active');
                activeItem.removeClass('active');
                indexOfItemInContent6--;
                
            }
            const offset = -width * indexOfItemInContent6;
            $('.content6-content > div').css('transform', 'translateX(' + offset + 'px)');
            
        })


        //img select in content 7
        
        $(document).on('click', '.avatar-content7', function(){
            const width = $('.content7-content-wrapper').width();
            if ($(this).hasClass('img-selected')){
                return;
            }else{
                //img
                $('.img-selected').removeClass('img-selected');
                $(this).addClass('img-selected');

                //content
                $('.content7-content-active').removeClass('content7-content-active');
                if ($(this).is('#first-content7-img')){
                    $('#first-content7-content').addClass('content7-content-active');
                    $('.content7-content').css('transform', 'translateX(' + 0 + 'px)');
                } else if ($(this).is('#second-content7-img')){
                    $('#second-content7-content').addClass('content7-content-active');
                    $('.content7-content').css('transform', 'translateX(' + -width + 'px)');
                } else {
                    $('#third-content7-content').addClass('content7-content-active');
                    $('.content7-content').css('transform', 'translateX(' + -width * 2 + 'px)');
                }
                
            }
        })
        
    })

    
    

})(jQuery);
    
