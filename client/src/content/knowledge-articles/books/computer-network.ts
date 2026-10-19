import type { KnowledgeArticleData } from "../types";
import { tcpIpOsiArticle } from "../computer-networks/network-architecture/tcp-ip-osi";
import { protocolServiceInterfaceArticle } from "../computer-networks/network-architecture/protocol-service-interface";
import { rateBandwidthThroughputArticle } from "../computer-networks/network-architecture/rate-bandwidth-throughput";
import { delayBandwidthProductArticle } from "../computer-networks/network-architecture/delay-bandwidth-product";
import { rttChannelUtilizationArticle } from "../computer-networks/network-architecture/rtt-channel-utilization";
import { nyquistShannonArticle } from "../computer-networks/physical-layer/nyquist-shannon";
import { dataSignalBaudArticle } from "../computer-networks/physical-layer/data-signal-baud";
import { switchingArticle } from "../computer-networks/physical-layer/switching";
import { encodingArticle } from "../computer-networks/physical-layer/encoding";
import { digitalAnalogArticle } from "../computer-networks/physical-layer/digital-analog";
import { transportMediumArticle } from "../computer-networks/physical-layer/transport-medium";
import { physicalLayerDevicesArticle } from "../computer-networks/physical-layer/physical-layer-devices";
import { parityCheckCodeArticle } from "../computer-networks/data-link-layer/parity-check-code";
import { crcArticle } from "../computer-networks/data-link-layer/crc";
import { hammingCodeArticle } from "../computer-networks/data-link-layer/hamming-code";
import { stopWaitProtocolArticle } from "../computer-networks/data-link-layer/stop-wait-protocol";
import { goBackNArticle } from "../computer-networks/data-link-layer/go-back-n";
import { selectiveRepeatArticle } from "../computer-networks/data-link-layer/selective-repeat-protocol";
import { protocolComparisonArticle } from "../computer-networks/data-link-layer/protocol-comparison";
import { multiplexingArticle } from "../computer-networks/data-link-layer/multiplexing";
import { alohaArticle } from "../computer-networks/data-link-layer/aloha-protocol";
import { csmaArticle } from "../computer-networks/data-link-layer/csma-protocol";
import { csmaCdArticle } from "../computer-networks/data-link-layer/csma-cd";
import { csmaCaArticle } from "../computer-networks/data-link-layer/csma-ca-protocol";
import { ethernetTokenRingArticle } from "../computer-networks/data-link-layer/ethernet-token-ring";
import { lanFrameArticle } from "../computer-networks/data-link-layer/local-area-network-frame";
import { vlanArticle } from "../computer-networks/data-link-layer/vlan";
import { hdlcPppArticle } from "../computer-networks/data-link-layer/hdlc-ppp";
import { switchingDeviceArticle } from "../computer-networks/data-link-layer/switching-device";
import { bridgeArticle } from "../computer-networks/data-link-layer/bridge";
import { ipAddressArticle } from "../computer-networks/network-layer/ip-address";
import { subnetArticle } from "../computer-networks/network-layer/subnet";
import { ipv4Article } from "../computer-networks/network-layer/ipv4";
import { ipv6Article } from "../computer-networks/network-layer/ipv6";
import { ipExtensionArticle } from "../computer-networks/network-layer/ip-extension";
import { arpArticle } from "../computer-networks/network-layer/arp";
import { icmpArticle } from "../computer-networks/network-layer/icmp";
import { dhcpArticle } from "../computer-networks/network-layer/dhcp";
import { ripArticle } from "../computer-networks/network-layer/rip";
import { ospfArticle } from "../computer-networks/network-layer/ospf";
import { bgpArticle } from "../computer-networks/network-layer/bgp";
import { routerArticle } from "../computer-networks/network-layer/router";
import { tcpHeaderArticle } from "../computer-networks/transport-layer/tcp-header";
import { tcpThreeWayHandshakeArticle } from "../computer-networks/transport-layer/tcp-three-way-handshake";
import { tcpReliableArticle } from "../computer-networks/transport-layer/tcp-reliable-transmission";
import { tcpFlowControlArticle } from "../computer-networks/transport-layer/tcp-flow-control";
import { udpHeaderArticle } from "../computer-networks/transport-layer/udp-header";
import { udpChecksumArticle } from "../computer-networks/transport-layer/udp-checksum";
import { dnsQueryArticle } from "../computer-networks/application-layer/dns-query";
import { httpConnectionCacheArticle } from "../computer-networks/application-layer/http-connection-cache";
import { ftpArticle } from "../computer-networks/application-layer/ftp";
import { emailArticle } from "../computer-networks/application-layer/email";

export const bookId = "computer-network";

/**
 * 本教材（计算机网络）知识正文按 pointId 索引。
 * 该模块整体作为独立的懒加载 chunk，进入知识页只加载当前教材。
 */
export const articlesByPoint: Record<string, KnowledgeArticleData> = {
  [tcpIpOsiArticle.pointId]: tcpIpOsiArticle,
  [protocolServiceInterfaceArticle.pointId]: protocolServiceInterfaceArticle,
  [rateBandwidthThroughputArticle.pointId]: rateBandwidthThroughputArticle,
  [delayBandwidthProductArticle.pointId]: delayBandwidthProductArticle,
  [rttChannelUtilizationArticle.pointId]: rttChannelUtilizationArticle,
  [nyquistShannonArticle.pointId]: nyquistShannonArticle,
  [dataSignalBaudArticle.pointId]: dataSignalBaudArticle,
  [switchingArticle.pointId]: switchingArticle,
  [encodingArticle.pointId]: encodingArticle,
  [digitalAnalogArticle.pointId]: digitalAnalogArticle,
  [transportMediumArticle.pointId]: transportMediumArticle,
  [physicalLayerDevicesArticle.pointId]: physicalLayerDevicesArticle,
  [parityCheckCodeArticle.pointId]: parityCheckCodeArticle,
  [crcArticle.pointId]: crcArticle,
  [hammingCodeArticle.pointId]: hammingCodeArticle,
  [stopWaitProtocolArticle.pointId]: stopWaitProtocolArticle,
  [goBackNArticle.pointId]: goBackNArticle,
  [selectiveRepeatArticle.pointId]: selectiveRepeatArticle,
  [protocolComparisonArticle.pointId]: protocolComparisonArticle,
  [multiplexingArticle.pointId]: multiplexingArticle,
  [alohaArticle.pointId]: alohaArticle,
  [csmaArticle.pointId]: csmaArticle,
  [csmaCdArticle.pointId]: csmaCdArticle,
  [csmaCaArticle.pointId]: csmaCaArticle,
  [ethernetTokenRingArticle.pointId]: ethernetTokenRingArticle,
  [lanFrameArticle.pointId]: lanFrameArticle,
  [vlanArticle.pointId]: vlanArticle,
  [hdlcPppArticle.pointId]: hdlcPppArticle,
  [switchingDeviceArticle.pointId]: switchingDeviceArticle,
  [bridgeArticle.pointId]: bridgeArticle,
  [ipAddressArticle.pointId]: ipAddressArticle,
  [subnetArticle.pointId]: subnetArticle,
  [ipv4Article.pointId]: ipv4Article,
  [ipv6Article.pointId]: ipv6Article,
  [ipExtensionArticle.pointId]: ipExtensionArticle,
  [arpArticle.pointId]: arpArticle,
  [icmpArticle.pointId]: icmpArticle,
  [dhcpArticle.pointId]: dhcpArticle,
  [ripArticle.pointId]: ripArticle,
  [ospfArticle.pointId]: ospfArticle,
  [bgpArticle.pointId]: bgpArticle,
  [routerArticle.pointId]: routerArticle,
  [tcpHeaderArticle.pointId]: tcpHeaderArticle,
  [tcpThreeWayHandshakeArticle.pointId]: tcpThreeWayHandshakeArticle,
  [tcpReliableArticle.pointId]: tcpReliableArticle,
  [tcpFlowControlArticle.pointId]: tcpFlowControlArticle,
  [udpHeaderArticle.pointId]: udpHeaderArticle,
  [udpChecksumArticle.pointId]: udpChecksumArticle,
  [dnsQueryArticle.pointId]: dnsQueryArticle,
  [httpConnectionCacheArticle.pointId]: httpConnectionCacheArticle,
  [ftpArticle.pointId]: ftpArticle,
  [emailArticle.pointId]: emailArticle,
};