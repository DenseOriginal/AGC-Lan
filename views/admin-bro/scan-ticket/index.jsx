import QrCodePopup from "@jimengio/qrcode-popup/lib/qrcode-popup";
import "react";
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
    this.updateState({ lanUser, loading: false });
  }

  updateState(partial) {
    this.setState(state => ({ ...state, ...partial }));
  }

  render() {
    return (
      <>
        <p>Code: { this.state.code }</p>
        <QrCodePopup
          onDetect={this.onScan}
        />
      </>
    )
  }
}

export default ScanTicket