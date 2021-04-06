import Component from '../component';

export default class Client extends Component {
  public origin: string;

  /**
   * Any additional features supported by client.
   */
  public extraFlags: boolean;

  constructor(origin: string) {
    super();

    this.origin = origin;

    /**
     * TODO: have clients send their feature set explicitly in LOGIN.session,
     * rather than assuming it based on the Origin header.
     */
    this.extraFlags = origin === 'https://test.airmash.online';
  }
}
