import { Client } from '@stomp/stompjs';
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/AuthStore';

let stompClient: Client | null = null;

export const connectWebSocket = () => {
  const { user, token } = useAuthStore.getState();
  if (!user || stompClient?.active) return;

  const url = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

  stompClient = new Client({
    webSocketFactory: () => new SockJS(url),
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: () => {
      // console.log(str); // Disabled in production
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    // Listen for Match notifications specific to this pharmacy's district matching cluster
    stompClient?.subscribe(`/topic/matches/${user.id}`, (msg) => {
       const body = JSON.parse(msg.body);
       useNotificationStore.getState().addToast({
         type: 'MATCH',
         title: 'New Swap Match Found!',
         message: body.message || 'You have a new algorithmic match waiting for your review.',
         link: '/matches'
       });
    });

    // Listen for incoming confirmations (from partners accepting swaps)
    stompClient?.subscribe(`/topic/swaps/${user.id}`, (msg) => {
       const body = JSON.parse(msg.body);
       useNotificationStore.getState().addToast({
         type: 'STATUS',
         title: 'Swap Update',
         message: body.message || 'Partner has accepted your swap!',
         link: `/swaps/active`
       });
    });
  };

  stompClient.onStompError = () => {
    // console.error('Broker reported error: ' + frame.headers['message']);
  };

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient?.active) {
    stompClient.deactivate();
  }
};
