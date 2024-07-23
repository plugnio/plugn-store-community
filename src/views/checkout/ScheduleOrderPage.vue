<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <button type="button" color="primary" @click="dismiss()">
                        <img src="../../assets/icons/close.svg" />
                    </button>
                </ion-buttons>

                <ion-title class="ion-text-center">

                    <span v-if="order.order_mode == 1">
                        {{ $t('Delivery Time') }}
                    </span>

                    <span v-if="order.order_mode == 2">
                        {{ $t('Pickup Time') }}
                    </span>

                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true"> 

            <ion-radio-group v-model="props.mode" @ionChange="updateExpectedAt()">
    
                <ion-item lines="none">
                    <ion-radio v-if="store.getters.isStoreOpen && store.state.shippingMethod.deliveryZone" 
                            labelPlacement="end" justify="start" value="asap" mode="md">
                        {{ toDuration(store.state.shippingMethod.deliveryZone.delivery_time, store.state.shippingMethod.deliveryZone.time_unit) }}
                    </ion-radio> 
                </ion-item>

                <ion-item lines="none">
                    <ion-radio v-if="props.deliveryData" justify="start" labelPlacement="end" value="scheduled" mode="md">
                        {{ $t('Schedule order') }}
                    </ion-radio> 
                </ion-item>
            </ion-radio-group>


            <div class="scrollmenu" v-if="props.deliveryData && props.mode == 'scheduled'">
                <section>
                    <ion-segment 
                        v-for="(scheduleDateTime, index) of props.deliveryData"
                        :key="index"
                        v-model="props.selectedWeek"
                        @ionChange="getAvailableTime($event, scheduleDateTime)" class="scheduleDateWrapper" mode="md">

                        <ion-segment-button v-if="scheduleDateTime.dayOfWeek != null" 
                            :value="scheduleDateTime.dayOfWeek"
                            mode="md">
                            <ion-label class="day-of-week">
                                <!-- todo: :class="{ capitalize: translateService.direction() == 'ltr' }"-->
                                <p class="day-of-week">
                                    {{ formatDate(scheduleDateTime.date, ' EEEE') }}  
                                    <!--
                                    {{ translateService.langContent(
                                        scheduleDateTime.date | date : ' EEEE',
                                        scheduleDateTime.date | date : ' EEEE' : '+0300': 'ar') }}-->
                                </p>
                                <p class="shortDate">
                                    {{ formatDate(scheduleDateTime.date, 'dd LLL') }} 
                                   <!--{{ 
                                        translateService.langContent(
                                            scheduleDateTime.date | date: 'dd LLL',
                                        scheduleDateTime.date | date: 'dd LLL' : '+0300': 'ar'
                                    ) }}-->
                                </p>
                            </ion-label>
                        </ion-segment-button>
                    </ion-segment>
                </section>
            </div>

            <ion-list v-if="props.selectedDeliveryTimeslots && props.mode == 'scheduled'"
                class="available-time">

                <ion-radio-group v-model="props.startTime" @ionChange="updateExpectedAt()">
 
                            <!--  
                            todo: translation 
                            {{ translateService.langContent(timeSlot.start_time | date : 'h:mm a',
                            timeSlot.start_time | date : 'h:mm a' : '+0300': 'ar') }} 
                            - 
                            {{
                            translateService.langContent(timeSlot.end_time | date : 'h:mm a', timeSlot.end_time | date :
                                'h:mm a' : '+0300': 'ar') }}
                                -->  
                    <ion-item v-for="(timeSlot, index2) of props.selectedDeliveryTimeslots" 
                            :key="index2">
                        <ion-radio :value="timeSlot.start_time" justify="start" labelPlacement="end" mode="md">
                            {{ formatDate(timeSlot.start_time, 'h:mm a') }}    
                            - 
                            {{ formatDate(timeSlot.end_time, 'h:mm a') }}    
                        </ion-radio> 
                    </ion-item>
                </ion-radio-group>

            </ion-list>

        </ion-content>

        <ion-footer>
            <ion-toolbar>
                <!-- Set time -->
                <!-- todo:
                    :class="{ "font-on-small-scrn": isPlatform.width() < 500 }" -->
                <ion-button expand="block" class="set-time-btn" @click="updateDeliveryTime() ">

                    <span>
                        {{ $t('Set time') }} | &nbsp;
                        <span v-if="props.mode == 'scheduled'">
                            
                            {{ formatDate(props.scheduledTimeStartFrom, 'E, dd MMM h:mm a') }}     
                             -
                            {{ formatDate(props.scheduledTimeTo, 'h:mm a') }}   
 <!-- 
                           
                                todo: translation 
                                {{ translateService.langContent(scheduledTimeStartFromForm.value['scheduledTimeStartFrom'] | date : 'E, dd MMM h:mm
                                                        a', scheduledTimeStartFromForm.value['scheduledTimeStartFrom'] | date : 'E، dd MMM h: mm a' : ' +0300': 'ar') }} -
                            {{ translateService.langContent(scheduledTimeTo | date : 'h:mm a', scheduledTimeTo | date : 'h:mm a' : '+0300':
                                'ar') }}
                            -->
                        </span>
                        <span v-if="props.mode == 'asap'">
                            {{ toDuration(store.state.shippingMethod.deliveryZone.delivery_time, store.state.shippingMethod.deliveryZone.time_unit) }}
                        </span>
                    </span>

                </ion-button>
            </ion-toolbar>
        </ion-footer>

    </ion-page>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonItem, IonLabel, IonList, IonPage, IonRadio, IonRadioGroup, IonSegment, IonSegmentButton, IonTitle, IonToolbar, modalController } from '@ionic/vue';

import router from '@/router';
import store from '@/store';
import { getScheduleData } from '../../services/DeliveryZoneService';
import { toDuration } from '../../pipes/duration';
import { formatDate } from '@/services/TranslateService';

defineProps(['order']);

const props = reactive({
    mode: 'asap',
    startTime: null, 
 
    selectedDeliveryDate: null, 
    scheduledTimeStartFrom: null, 
    scheduledTimeTo: null, 

    deliveryData: null, 
    selectedDeliveryTimeslots: [],
    selectedWeek: null
});
  

function dismiss(data = {}) {
    modalController.getTop().then(o => {
        if(o) {
            modalController.dismiss(data);
        } else if(window.history.length > 0) {
            router.back();
        } else {
            router.push('/');
        }
    });
}

onMounted(() => {
 
    if (!store.state.shippingMethod) {
        dismiss();
    }

    /*if(store.state.deliveryTime) { 
        props.selectedDeliveryTimeslots = store.state.deliveryTime.selectedDeliveryTimeslots;
        props.scheduledTimeStartFrom = store.state.deliveryTime.scheduledTimeStartFrom;
        props.scheduledTimeTo = store.state.deliveryTime.scheduledTimeTo;
        props.deliveryData = store.state.deliveryTime.deliveryData;

        if(store.state.deliveryTime.isOrderScheduled) {
            props.mode = "scheduled";
        }
    }*/

    getScheduleData().then(response => {
  
        props.deliveryData  = response.deliveryData;
  
        if(!store.getters.isStoreOpen) {
            props.mode = "scheduled";
        }

        props.selectedWeek = props.deliveryData[0]['dayOfWeek'];

        props.selectedDeliveryDate = props.deliveryData[0].date;

        props.selectedDeliveryTimeslots = props.deliveryData[0]['scheduleTimeSlots'];
        
        props.startTime = props.selectedDeliveryTimeslots[0]['start_time'];
        
        updateExpectedAt();
    }).catch((e) => {
        console.error(e);
    }); 
});
  
function getAvailableTime(event, selectDateData) {

    if (event.target.value != null && props.deliveryData) {

        const dayData = props.deliveryData.find(scheduleDate => scheduleDate.dayOfWeek == event.target.value);
 
        props.selectedDeliveryTimeslots = dayData['scheduleTimeSlots'];

        props.startTime = props.selectedDeliveryTimeslots[0]['start_time'];
        
        props.selectedDeliveryDate = selectDateData.date;

        props.selectedWeek = selectDateData.dayOfWeek;

        /**
        props.scheduledTimeStartFrom = props.selectedDeliveryTimeslots[0]['start_time'];
        props.scheduledTimeTo = props.selectedDeliveryTimeslots[0]['end_time'];
         */

        updateExpectedAt();
    }
}

function updateExpectedAt() {
 
    const endTime = props.selectedDeliveryTimeslots.filter(data => 
            data.start_time == props.startTime)[0]['end_time'];

    props.scheduledTimeStartFrom = props.startTime;

    props.scheduledTimeTo = endTime;    
}

function addTimeToDate(time, date) {

    const yy = new Date(date).getFullYear();
    const mm = new Date(date).getMonth() + 1;    
    const dd = new Date(date).getDate();

    let interMedDt = new Date(yy + '-' + dd + '-' + mm);

    interMedDt.setHours((time.split(' ')[0]).split(':')[0]);
    interMedDt.setMinutes((time.split(' ')[0]).split(':')[1]);

    return interMedDt;
}
 
function updateDeliveryTime() {

  const deliveryTime = {  
    'isOrderScheduled': props.mode == "asap"? false: true,
    //'selectedDeliveryTimeslots': props.selectedDeliveryTimeslots,
    'scheduledTimeStartFrom': props.scheduledTimeStartFrom,
    'scheduledTimeTo': props.scheduledTimeTo,
    //'deliveryData': props.deliveryData,
  };

  store.commit('setDeliveryTime', deliveryTime); 

  dismiss(deliveryTime);
}

</script>
<style lang="scss" scoped>
.scrollmenu {
    overflow-y: auto;
    border-top: 2px solid rgb(245, 245, 245);
    border-bottom: 2px solid rgb(245, 245, 245);
    border-image: initial;
    border-left: none;
    border-right: none;
    width: 100%;

    section {
        display: flex;
    }
}


.day-of-week {

    font-size: 15px;
    font-weight: 600;
    line-height: 1.41;
    letter-spacing: -0.4px;
    margin: 0px;
    color: rgb(0, 0, 0);
    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: auto;

}

.shortDate {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.33;
    letter-spacing: -0.2px;
    margin: 0px;
    color: rgb(97, 97, 97);
    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
}

.scheduleDateWrapper {

    display: inline-block;
    text-decoration: none;

    box-shadow: none;
    padding: 8px;
    margin: 0px;
    position: relative;
    cursor: pointer;
    vertical-align: baseline;
    padding: 0px;
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    height: 68px;
    width: 108px;

}



[dir="ltr"] .available-time {
    padding-left: 24px;
}

[dir="rtl"] .available-time {
    padding-right: 24px;
}

ion-segment-button:active {
    --background-active: rgb(245, 245, 245) !important;
}

ion-segment-button {
    --background-checked: rgb(245, 245, 245);
    --background-hover: none;
    --background-focused: none;
    --background-active: none;
    --color-focused: transparent;
    --color-checked: transparent;
    --background-actived: none;
    --indicator-color: none;
    height: 100%;
    --indicator-color: transparent !important;
    --indicator-color-checked: transparent !important;
}


ion-footer {
    .set-time-btn {
        height: 48px;
        text-transform: none;
    }
}

.font-on-small-scrn {
    span {
        font-size: 14px !important;
        letter-spacing: initial;
    }
}</style>