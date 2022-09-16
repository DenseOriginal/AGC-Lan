import QrCodePopup from "@jimengio/qrcode-popup/lib/qrcode-popup";
import "react";
import { ButtonContainer, ButtonStyles, ContainerStyles, ErrorStyles, GridCenter, PaidStyles, PanelStyles, StrongStyles, TextAlignCenter, ViewStyles } from "./styles";
import { getLanUser, setLanUserPaidStatus } from "./web";

class ScanTicket extends React.Component {
  state = {
    code: undefined,
    lanUser: undefined,
    loading: false,
    error: ''
  };

  onScan = async (code) => {
    try {
      this.updateState({ code, loading: true });
      const lanUser = await getLanUser(code);
      this.updateState({ lanUser, loading: false });
    } catch (error) {
      this.updateState({ error })
    }
  }

  markAsPaid = async () => {
    try {
      this.updateState({ loading: true });

      const lanUser = this.state.lanUser;
      const res = await setLanUserPaidStatus(lanUser._id, true);
      if (res.success) {
        this.updateState({
          lanUser: { ...lanUser, has_paid: true },
          loading: false
        });
      }
    } catch (error) {
      this.updateState({ error })
    }
  }

  updateState(partial) {
    this.setState(state => ({ ...state, ...partial }));
  }

  render() {
    const { code, lanUser, loading, error } = this.state;

    const seat = lanUser?.seat == 'none' ? 'Ingen plads valgt' : lanUser?.seat;

    return (
      <div className="view" style={ViewStyles}>
        <div style={{...ContainerStyles, ...GridCenter}}>
          <div style={PanelStyles}>
            {!code && <p style={TextAlignCenter}>Start ved at scanne en tilmelding</p>}
            {loading && <p style={TextAlignCenter}>Henter data</p>}
            {lanUser && !loading && <div>
              <strong style={StrongStyles}>Bruger oplysninger</strong>
              <p>Navn: { lanUser?.user.first_name }</p>
              <p>Klasse: { lanUser?.user.class }</p>
              <p>Brugernavn: { lanUser?.user.username }</p>
              <p>Plads: { seat }</p>
              
              <br />

              <strong style={StrongStyles}>Lan oplysninger</strong>
              <p>Lan: { lanUser?.lan.name }</p>
              <p>Pris: { lanUser?.lan.price } DKK</p>

              <br />
              <br />

              <p>Status: <PaidStatus hasPaid={lanUser?.has_paid} /></p>
            </div>}
          </div>

          {lanUser && <div style={{ ...PanelStyles, ...ButtonContainer }}>
            {!lanUser.has_paid && <Button onClick={this.markAsPaid}>Marker som betalt</Button>}
          </div>}

          <div style={PanelStyles}>
            <QrCodePopup
              onDetect={this.onScan}
            />
          </div>

          <div>
            {error && <p style={{ ...ErrorStyles, ...StrongStyles }}>Der er sket en fejl, prøv igen senere</p>}
            <p style={{ ...ErrorStyles, ...StrongStyles }}>{error.toString()}</p>
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

function Button({ color, children, ...rest }) {
  return <button style={ButtonStyles(color || 'blue')} {...rest}>{children}</button>
}