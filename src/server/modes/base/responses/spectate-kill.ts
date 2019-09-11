import { SERVER_PACKETS, ServerPackets } from '@airbattle/protocol';
import { RESPONSE_SPECTATE_KILL, CONNECTIONS_SEND_PACKET } from '@/events';
import { System } from '@/server/system';
import { MainConnectionId, PlayerId } from '@/types';

export default class SpectateKillResponse extends System {
  constructor({ app }) {
    super({ app });

    this.listeners = {
      [RESPONSE_SPECTATE_KILL]: this.onSpectateKill,
    };
  }

  /**
   * Send `PLAYER_KILL` packet only to the player, who switched
   * into spectate mode. It needs to instant hide an airplane object
   * on the screen.
   * Zero values for killer, posX and posY are required.
   *
   * @param connectionId
   * @param playerId
   * @param posX
   * @param posY
   */
  onSpectateKill(connectionId: MainConnectionId, playerId: PlayerId, posX = 0, posY = 0): void {
    this.emit(
      CONNECTIONS_SEND_PACKET,
      {
        c: SERVER_PACKETS.PLAYER_KILL,
        id: playerId,
        killer: 0,
        posX,
        posY,
      } as ServerPackets.PlayerKill,
      connectionId
    );
  }
}
