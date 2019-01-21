import {decorate, observable, action, configure} from "mobx"
import { create, persist } from 'mobx-persist'
import { AsyncStorage } from "react-native";
import axios from "axios";

class Guide {
    @persist @observable token = null;
    @persist @observable id = null;
    @persist @observable email = "";
    @persist @observable password = "";
    @persist @observable name = "";
    @persist @observable phone = "";
    @persist @observable bio = "";
    @persist @observable rating = null;
    @persist @observable rating_count = 0;
    @persist @observable photo_path = null;
    @persist @observable createdAt = null;

    @action login(data){
        this.token = data.token;
        this.id = data.user.User.id;
        this.email = data.user.User.email;
        this.password = data.user.User.password;
        this.name = data.user.User.name;
        this.phone = data.user.User.phone;
        this.bio = data.user.User.bio;
        this.rating = data.user.total_guide_score;
        this.rating_count = data.user.n_guide_score;
        this.createdAt = data.user.User.createdAt;
        this.photo_path = data.user.User.photo_path;
    }

    @action updateGuide(data){
        //this.name = data.name;
        //this.phone = data.phone;
        this.bio = data.bio;
    }

    @action logout(){
        this.token = null;
        this.id = null;
        this.email = "";
        this.password = "";
        this.name = "";
        this.phone = "";
        this.bio = "";
        this.photo_path = null;
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
        console.log(guideStore.token);
        console.log('Success')
    })
    .catch(() => console.log('Couldn\'t hydrate'));

export default guideStore;