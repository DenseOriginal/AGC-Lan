import QrCodePopup from "@jimengio/qrcode-popup/lib/qrcode-popup";
import "react";
import { ContainerStyles, GridCenter, PaidStyles, PanelStyles, TextAlignCenter, ViewStyles } from "./styles";
import { getLanUser } from "./web";

class ScanTicket extends React.Component {
  state = {
    code: undefined,
    lanUser: undefined,
    loading: false,
  };

  onScan = async (code) => {
    this.updateState({ code, loading: true });
    const lanUser = await getLanUser(code);
    console.log(lanUser);
    this.updateState({ lanUser, loading: false });
  }

  updateState(partial) {
    this.setState(state => ({ ...state, ...partial }));
  }

  render() {
    const { code, lanUser, loading } = this.state;

    return (
      <div className="view" style={ViewStyles}>
        <div style={{...ContainerStyles, ...GridCenter}}>
          <div style={PanelStyles}>
            {!code && <p style={TextAlignCenter}>Start ved at scanne en tilmelding</p>}
            {loading && <p style={TextAlignCenter}>Henter data</p>}
            {lanUser && <div>
              <p>Navn: { lanUser?.user.first_name }</p>
              <p>Klasse: { lanUser?.user.class }</p>
              <p>Brugernavn: { lanUser?.user.username }</p>
              
              <br />

              <p>Lan: { lanUser?.lan.name }</p>
              <p>Pris: { lanUser?.lan.price } DKK</p>

              <br />

              <p>Status: <PaidStatus hasPaid={lanUser?.has_paid} /></p>
            </div>}
          </div>

          <div style={PanelStyles}>
            <QrCodePopup
              onDetect={this.onScan}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default ScanTicket

function PaidStatus({ hasPaid }) {
  return hasPaid ?
    <span style={PaidStyles(hasPaid)}>Betalt</span> :
    <span style={PaidStyles(hasPaid)}>Mangler betaling</span>
}