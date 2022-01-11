import { v4 as uuidv4 } from 'uuid';

export default class NonceService {
  public getNonce() {
    return uuidv4()
  }
}
