<template>
  <div>
    <div class="card-header">
        <span>{{ title }}</span>
        <svg t="1674909223211" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1052" width="200" height="200"><path d="M510.12 961.63c-60.5 0-119.19-11.85-174.46-35.23-53.37-22.57-101.3-54.89-142.45-96.04s-73.47-89.08-96.04-142.45c-23.38-55.27-35.23-113.96-35.23-174.46 0-60.5 11.85-119.19 35.23-174.46 22.57-53.37 54.89-101.3 96.04-142.45s89.08-73.47 142.45-96.04c55.27-23.38 113.96-35.23 174.46-35.23s119.19 11.85 174.46 35.23c53.37 22.57 101.3 54.89 142.45 96.04S900.5 285.63 923.07 339c23.38 55.27 35.23 113.96 35.23 174.46 0 60.49-11.85 119.19-35.23 174.46-22.57 53.37-54.89 101.3-96.04 142.45s-89.08 73.47-142.45 96.04c-55.27 23.37-113.97 35.22-174.46 35.22z m0-858.04c-226 0-409.86 183.86-409.86 409.86 0 225.66 184.2 409.86 409.86 409.86 226 0 409.86-183.86 409.86-409.86 0-225.65-184.2-409.86-409.86-409.86z" p-id="1053" fill="#cdcdcd"></path><path d="M485.67 581.91l-16.96-166.32c-0.07-0.64-0.1-1.28-0.1-1.93v-73.25c0-10.49 8.51-19 19-19h44.78c10.49 0 19 8.51 19 19v73.27c0 0.64-0.03 1.27-0.1 1.9l-16.73 166.3c-0.98 9.71-9.15 17.1-18.91 17.1h-11.07c-9.75 0-17.92-7.38-18.91-17.07z" p-id="1054" fill="#cdcdcd"></path><path d="M488.92 628.75h42.16c10.49 0 19 8.51 19 19v37.46c0 10.49-8.51 19-19 19h-42.16c-10.49 0-19-8.51-19-19v-37.46c0-10.5 8.5-19 19-19z" fill="#cdcdcd" p-id="1055"></path></svg>
    </div>
    <div class="card-content">{{count}}</div>
    <div class="card-charts">
        <slot name="charts"></slot>
    </div>
    <div class="card-footer">
        <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { title } from 'process';

export default {
    name:'Detail',
    props:['title','count']
}
</script>

<style>
    .card-header{
        display: flex;
        justify-content: space-between;
        color:#d9d9d9;
        font-size: 16px;
    }
    .icon{
        width: 20px;
        height: 20px;
    }
    .card-content{
        font-size: 30px;
        margin: 10px 0;
    }
    .card-charts{
        width: 100%;
        height: 50px;
    }
    .card-footer{
        border-top: 1px solid grey;
        height: 20px;
        padding-top: 10px;
    }
    
</style>