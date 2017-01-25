import { Cat } from '../models/cat.model';

export class CatService {

    getCats(){ 
       return [{
                id: 1,
                name: 'Fluffy Smith',
                username: 'fluffysmith',
                time: '33s',
                text: 'Chase mice and mark territory. Or intently stare at the same spot. Whatever floats your boat!'},
            {   id: 2,
                name: 'Pinky Pawkins',
                username: 'pinkypawkins',
                time: '1d',
                text: 'Balls of yarn are my joy and life. And sitting in boxes. And wet food. And biting.'}
            ];
    }
}

