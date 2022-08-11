<script>
 import { readable } from 'svelte/store';
 const time = readable(new Date(), (set) => {
     let timeout;
     function update() {
         timeout = setTimeout(() => {
             set(new Date());
             update();
         }, (60 - new Date().getSeconds())*1000);
     }
     update();
     return () => clearTimeout(timeout);
 });
</script>

<div class="taskbar">
    <div class="menu">BismuthSoft</div>
    <div class="tasks">
        <h1>FMSite</h1>
    </div>
    <div class="empty"></div>
    <div class="clock">{`${$time.getHours()}:${('0'+$time.getMinutes()).slice(-2)}`}</div>
</div>

<style>
 .taskbar {
     display: flex;
     gap: 1em;
     place-items: center;
     background: #0053e5;
     color: white;
     position: absolute;
     bottom: 0;
     width: 100%;
     position: sticky;
     border-top: solid #333 .2rem;
     z-index: 9;
 }
 .menu, .tasks *, .clock {
     padding: 1em;
 }
 .tasks *, .clock {
     background: #2e89f1;
 }
 .taskbar .menu {
     background: #2e872d;
     font-weight: bold;
     border-radius: 0 .5em .5em 0 / 0 1em 1em 0;
     border-right: solid #333 .2rem;
 }
 .taskbar .tasks * {
     border-radius: .5em;
     border-left: solid #333 .2rem;
     border-right: solid #333 .2rem;
 }
 .taskbar .empty {
     flex-grow: 1;
 }
 .taskbar .clock {
     border-radius: .5em 0 0 .5em / 1em 0 0 1em;
     border-left: solid #333 .2rem;
 }
 h1 {
     font-size: 1em;
     margin: 0;
     font-weight: normal;
 }
</style>
