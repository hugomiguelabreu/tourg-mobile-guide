import {decorate, observable, action, configure} from "mobx"
import { create, persist } from 'mobx-persist'
import { AsyncStorage } from "react-native";
import axios from "axios";
import {Notifications, Permissions} from "expo";
const PUSH_ENDPOINT = 'https://your-server.com/users/push-token';

class Guide {
    @persist @observable token = null;
    @persist @observable id = null;
    @persist @observable email = "";
    @persist @observable password = "";
    @persist @observable name = "";
    @persist @observable phone = "";
    @persist @observable bio = "";
    @persist @observable rating = null;
    @persist @observable iban = "";
    @persist @observable swift = "";
    @persist @observable rating_count = 0;
    @persist @observable photo_path = null;
    @persist @observable createdAt = null;

    @action login(data){
        this.token = data.token;
        this.id = data.user.id;
        this.email = data.user.User.email;
        this.password = data.user.User.password;
        this.name = data.user.User.name;
        this.phone = data.user.User.phone;
        this.bio = data.user.User.bio;
        this.rating = data.user.total_guide_score;
        this.rating_count = data.user.n_guide_score;
        this.iban = data.user.account_number;
        this.swift = data.user.swift;
        this.createdAt = data.user.User.createdAt;
        this.photo_path = data.user.User.photo_path;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + guideStore.token;
        registerForPushNotificationsAsync();
    }

    @action updateGuide(data){
        //this.name = data.name;
        //this.phone = data.phone;
        this.bio = data.bio;
    }

    @action updatePhoto(uri){
        this.photo_path = uri;
    }

    @action logout(){
        this.token = null;
        this.id = null;
        this.email = "";
        this.password = "";
        this.name = "";
        this.phone = "";
        this.bio = "";
        this.rating = null;
        this.iban = "";
        this.swift = "";
        this.rating_count = 0;
        this.photo_path = null;
        this.createdAt = null;
    }
}

configure({enforceActions: 'observed'});

const guideStore = new Guide();

const hydrate = create({
    storage: AsyncStorage,   // or AsyncStorage in react-native.
                            // default: localStorage
    jsonify: true  // if you use AsyncStorage, here shoud be true
                    // default: true
});

hydrate('guide', guideStore)
    .then(() => {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + guideStore.token;
        registerForPushNotificationsAsync();
        console.log(guideStore.token);
        console.log('Success')
    })
    .catch(() => console.log('Couldn\'t hydrate'));

async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return axios.post('/guide/update_token',
        {notification_token: token})
        .then((resp) => {
            console.log(resp.data);
            return resp.data;
        })
        .catch((err) => {
            console.log(err);
        });
}

export default guideStore;