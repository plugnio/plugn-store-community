<template>
    <div class="update-alert" dir="ltr">
      <div class="wrapper">
        <div class="title">{{ $t('A new version is available') }}</div>
        <div class="btn-refresh">
          &nbsp;
          <span class="ag a8k" tabindex="0" role="link" @click="refresh">
            {{ $t('Refresh') }}
          </span>
        </div>
      </div>
      <div tabindex="0" role="button" class="btn-close" @click="close">
        <ion-icon :icon="closeOutline"></ion-icon>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';


//import store from '@/store';

    function refresh() {
        window.location.reload();
    }

    function close() {
        window.location.reload();
        //store.state.appUpdateAvailable = false;//ignore, might keep showing again and again 
        // Implement the close logic here
    }
</script>
  
<style lang="scss">
[dir="ltr"].update-alert {
    padding-right: 52px;
    right: auto;
    text-align: left;

    .btn-refresh {
        margin-left: -16px;
        margin-right: auto;

        span {
            margin-left: 8px;
        }
    }

    .btn-close {
        right: 16px;
    }
}

[dir="rtl"].update-alert {
    padding-left: 52px;
    left: auto;
    text-align: right;

    .btn-refresh { 
        margin-left: auto;
    }

    span {
        margin-right: 8px;
    }

    .btn-close {
        left: 16px;
    }
    .title {
        margin: auto;
    }
}

.update-alert {
    box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.302), 0 4px 8px 3px rgba(60, 64, 67, 0.149);
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
    letter-spacing: .2px;
    -webkit-align-items: center;
    align-items: center;
    background-color: #202124;
    border: none;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    bottom: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #fff;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    font-weight: 400;
    left: 0;
    margin: 24px;
    max-width: 640px;
    min-height: 52px;
    padding: 8px 24px;
    position: fixed;
    top: auto;

    .title {
        margin: 10px 24px 10px 0;
    }

    .wrapper {
        display: -webkit-box;
        display: -moz-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;
        position: relative;
    }

    .btn-refresh {
        font-size: 0;
        height: 40px;

        span {
            align-items: center;
            border: none;
            display: inline-flex;
            justify-content: center;
            position: relative;
            z-index: 0;
            -webkit-font-smoothing: antialiased;
            font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
            font-size: 14px;
            letter-spacing: .15px;
            background: none;
            border-radius: 4px;
            box-sizing: border-box;
            cursor: pointer;
            font-weight: 500;
            height: 40px;
            outline: none;
            color: #8ab4f8;
            min-width: auto;
            padding: 0 8px;
            text-decoration: none;
        }
    }

    .btn-close {
        align-items: center;
        border: none;
        display: inline-flex;
        justify-content: center;
        outline: none;
        z-index: 0;
        cursor: pointer;
        position: absolute;
        top: 16px;
        ion-icon {
            font-size: 20px;
        }
    }
}
</style>