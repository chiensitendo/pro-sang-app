import {DraftStyleMap} from "draft-js";
import {Property} from "csstype";


const POSITION: Property.Position[] = ["relative"];

const customStyleMap: DraftStyleMap = {}


POSITION.forEach((pos: any) => {
    const prefix = "POSITION";
    customStyleMap[prefix+'-'+pos] = {
        position: pos
    }
});

export default customStyleMap;