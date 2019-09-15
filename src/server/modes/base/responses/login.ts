import { encodeUpgrades, ServerPackets, SERVER_PACKETS } from '@airbattle/protocol';
import { RESPONSE_LOGIN, CONNECTIONS_SEND_PACKET, BROADCAST_CHAT_SERVER_WHISPER } from '@/events';
import { System } from '@/server/system';
import { MainConnectionId } from '@/types';

export default class LoginResponse extends System {
  constructor({ app }) {
    super({ app });

    this.listeners = {
      [RESPONSE_LOGIN]: this.onLoginResponse,
    };
  }

  /**
   * Response to player's `Login` request.
   *
   * @param connectionId
   */
  onLoginResponse(connectionId: MainConnectionId): void {
    const connection = this.storage.connectionList.get(connectionId);
    const player = this.storage.playerList.get(connection.meta.playerId);
    const players = [];

    /**
     * TODO: it is possible to keep the list up to date and not re-create it
     * every time a new player connected.
     */
    this.storage.playerList.forEach(p => {
      players.push({
        id: p.id.current,
        status: p.alivestatus.current,
        level: p.level.current,
        name: p.name.current,
        type: p.planetype.current,
        team: p.team.current,
        posX: p.position.x,
        posY: p.position.y,
        rot: p.rotation.current,
        flag: p.flag.code,
        upgrades: encodeUpgrades(p.upgrades.speed, ~~p.shield.current, ~~p.inferno.current),
      });
    });

    this.emit(
      CONNECTIONS_SEND_PACKET,
      {
        c: SERVER_PACKETS.LOGIN,
        success: true,
        id: player.id.current,
        team: player.team.current,
        clock: this.helpers.clock(),
        token: player.backuptoken.current,
        type: this.app.config.server.typeId,
        room: this.app.config.server.room,
        players,
      } as ServerPackets.Login,
      connectionId
    );

    this.delay(
      BROADCAST_CHAT_SERVER_WHISPER,
      connection.meta.playerId,
      "🤖 Welcome"
    );
    this.delay(
      BROADCAST_CHAT_SERVER_WHISPER,
      connection.meta.playerId,
      "🤖 Humans may only fly forwards here"
    );
    this.delay(
      BROADCAST_CHAT_SERVER_WHISPER,
      connection.meta.playerId,
      "🤖 Never backwards"
    );
    this.delay(
      BROADCAST_CHAT_SERVER_WHISPER,
      connection.meta.playerId,
      "🤖 Share and enjoy"
    );
  }
}
