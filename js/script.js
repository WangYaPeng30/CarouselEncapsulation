class slider{
    constructor(containerId, itemClass, targetClass, arrowLeft, arrowRight, dotsClass, dotSelected) {
        //容器
        this.container = document.getElementById(containerId);
        //图片列表、点列表
        this.itemList = this.container.querySelectorAll(`.${itemClass}`)
        const dots = this.container.querySelectorAll(`.${dotsClass}`)
        //左右箭头
        const arrowL = this.container.querySelector(`.${arrowLeft}`)
        const arrowR = this.container.querySelector(`.${arrowRight}`)
        //计时器、列表长度、目标元素的类名
        this.timer = null;
        this.len = this.itemList.length;
        this.targetClass = targetClass;
        //箭头的点击事件
        arrowL.addEventListener('click', e => {
            this.stop();
            this.slideStep(false);
            this.start();
            e.preventDefault();
        })
        arrowR.addEventListener('click', e => {
            this.stop();
            clearInterval(this.timer);
            this.slideStep(true);
            this.start();
            e.preventDefault();
        })
        //点列表的移入移出事件
        for(let i = 0 ; i < this.len ; i++) {
            dots[i].addEventListener('mouseover', e => {
                this.stop();
                this.slideTo(i);
            })
            dots[i].addEventListener('mouseout', e => {
                this.start();
            })
        }
        //slide事件
        this.container.addEventListener('slide', e => {
            const dotActive = this.container.querySelector(`.${dotSelected}`); //获取事件触发之前的活跃点
            const preIndex = Array.from(dots).indexOf(dotActive); //之前的活跃点的id
            dots[preIndex].classList.remove(dotSelected); //去掉活跃点的样式
            dots[e.detail.idx].classList.add(dotSelected); //给事件触发之后的活跃点添加样式
        })
    }
    //获取被选中图片的信息：图片本身、图片id
    getSelectedMsg() {
        const item = this.container.querySelector(`.${this.targetClass}`);
        const index = Array.from(this.itemList).indexOf(item)
        return { item, index }
    }
    //单步滑动与跳跃滑动
    slideStep(next) {
        if( typeof next != 'boolean' ) return;
        const index = this.getSelectedMsg().index; //当前被选中图片的id
        const toIndex = next ? (index+1)%this.len : (index+this.len-1)%this.len; //接下来要去往的图片的id
        this.slideTo(toIndex);
    }
    slideTo(index) {
        const selectedMsg = this.getSelectedMsg();
        selectedMsg.item.classList.remove(this.targetClass);
        this.itemList[index].classList.add(this.targetClass);

        //自定义事件,用于每次滑动调整导航点样式
        const detail = {idx:index};
        const event = new CustomEvent('slide', {detail})
        this.container.dispatchEvent(event)
    }
    //计时器打开与关闭
    start() {
        this.timer = setInterval(() => {
            this.slideStep(true)
        }, 2000);
    }
    stop() {
        clearInterval(this.timer)
    }
}

const s = new slider('slider', 'slider-list__item', 'slider-list__selected', 'left', 'right', 'slider-list__dot', 'slider-list__dot__selected');
s.start();


