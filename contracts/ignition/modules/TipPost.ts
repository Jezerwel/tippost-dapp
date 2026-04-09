import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TipPostModule = buildModule("TipPost", (m) => {
  // Deploy the TipPost contract (no constructor arguments needed - uses constants)
  const tipPost = m.contract("TipPost");

  return { tipPost };
});

export default TipPostModule;
