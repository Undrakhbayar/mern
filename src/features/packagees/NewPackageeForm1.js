import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewPackageeMutation } from "./packageesApiSlice"

const NewPackageeForm = ({ users }) => {

    const [addNewPackagee, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewPackageeMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [houseSeq, setHouseSeq] = useState('')
    const [mailId, setMailId] = useState('')
    const [blNo, setBlNo] = useState('')
    const [netWgt, setNetWgt] = useState('')
    const [wgt, setWgt] = useState('')
    const [qty, setQty] = useState('')
    const [transFare, setTransFare] = useState('')
    const [price1, setPrice1] = useState('')
    const [goodsNm, setGoodsNm] = useState('')
    const [shipperNm, setShipperNm] = useState('')
    const [consigneeCntryNm, setConsigneeCntryNm] = useState('')
    const [consigneeNm, setConsigneeNm] = useState('')
    const [consigneeReg, setConsigneeReg] = useState('')
    const [consigneeTel, setConsigneeTel] = useState('')
    const [compName, setCompName] = useState('')
    const [compRegister, setCompRegister] = useState('')
    const [compAddr, setCompAddr] = useState('')
    const [compTel, setCompTel] = useState('')
    const [userId, setUserId] = useState(users[0].id)

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setHouseSeq('')
            setUserId('')
            navigate('/dash/packagees')
        }
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onHouseSeqChanged = e => setHouseSeq(e.target.value)
    const onMailIdChanged = e => setMailId(e.target.value)
    const onBlNoChanged = e => setBlNo(e.target.value)
    const onNetWgtChanged = e => setNetWgt(e.target.value)
    const onWgtChanged = e => setWgt(e.target.value)
    const onQtyChanged = e => setQty(e.target.value)
    const onTransFareChanged = e => setTransFare(e.target.value)
    const onPrice1Changed = e => setPrice1(e.target.value)
    const onGoodsNmChanged = e => setGoodsNm(e.target.value)
    const onShipperNmChanged = e => setShipperNm(e.target.value)
    const onConsigneeCntryNmChanged = e => setConsigneeCntryNm(e.target.value)
    const onConsigneeNmChanged = e => setConsigneeNm(e.target.value)
    const onConsigneeRegChanged = e => setConsigneeReg(e.target.value)
    const onConsigneeTelChanged = e => setConsigneeTel(e.target.value)
    const onCompNameChanged = e => setCompName(e.target.value)
    const onCompRegisterChanged = e => setCompRegister(e.target.value)
    const onCompAddrChanged = e => setCompAddr(e.target.value)
    const onCompTelChanged = e => setCompTel(e.target.value)

    const canSave = [houseSeq, userId].every(Boolean) && !isLoading

    const onSavePackageeClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewPackagee({ user: userId, houseSeq, mailId, blNo, netWgt, wgt, qty, transFare, price1, goodsNm, shipperNm, consigneeCntryNm, 
                consigneeNm, consigneeReg, consigneeTel, compName, compRegister, compAddr, compTel })
        }
    }

     const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}
            > {user.username}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    const validHouseSeqClass = !houseSeq ? "form__input--incomplete" : ''
    const validMailIdClass = !mailId ? "form__input--incomplete" : ''
    const validBlNoClass = !blNo ? "form__input--incomplete" : ''
    const validNetWgtClass = !netWgt ? "form__input--incomplete" : ''
    const validWgtClass = !wgt ? "form__input--incomplete" : ''
    const validQtyClass = !qty ? "form__input--incomplete" : ''
    const validTransFareClass = !transFare ? "form__input--incomplete" : ''
    const validPrice1Class = !price1 ? "form__input--incomplete" : ''
    const validGoodsNmClass = !goodsNm ? "form__input--incomplete" : ''
    const validShipperNmClass = !shipperNm ? "form__input--incomplete" : ''
    const validConsigneeCntryNmClass = !consigneeCntryNm ? "form__input--incomplete" : ''
    const validConsigneeNmClass = !consigneeNm ? "form__input--incomplete" : ''
    const validConsigneeRegClass = !consigneeReg ? "form__input--incomplete" : ''
    const validConsigneeTelClass = !consigneeTel ? "form__input--incomplete" : ''
    const validCompNameClass = !compName ? "form__input--incomplete" : ''
    const validCompRegisterClass = !compRegister ? "form__input--incomplete" : ''
    const validCompAddrClass = !compAddr ? "form__input--incomplete" : ''
    const validCompTelClass = !compTel ? "form__input--incomplete" : ''


    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSavePackageeClicked}>
                <div className="form__title-row">
                    <h2>New Packagee</h2>
                    <div className="form__action-buttons">
                    <button
                        className="text-button"
                        title="Save"
                        disabled={!canSave}
                    >
                        Хадгалах
                    </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="houseSeq"> HOUSE_SEQ:</label>
                <input
                    className={`form__input ${validHouseSeqClass}`}
                    id="houseSeq"
                    name="houseSeq"
                    type="text"
                    autoComplete="off"
                    value={houseSeq}
                    onChange={onHouseSeqChanged}
                />
                <label className="form__label" htmlFor="mailId"> MAIL_ID:</label>
                <input
                    className={`form__input ${validMailIdClass}`}
                    id="mailId"
                    name="mailId"
                    type="text"
                    autoComplete="off"
                    value={mailId}
                    onChange={onMailIdChanged}
                />
                <label className="form__label" htmlFor="blNo"> BL_NO:</label>
                <input
                    className={`form__input ${validBlNoClass}`}
                    id="blNo"
                    name="blNo"
                    type="text"
                    autoComplete="off"
                    value={blNo}
                    onChange={onBlNoChanged}
                />
                <label className="form__label" htmlFor="netWgt"> NET_WGT:</label>
                <input
                    className={`form__input ${validNetWgtClass}`}
                    id="netWgt"
                    name="netWgt"
                    type="text"
                    autoComplete="off"
                    value={netWgt}
                    onChange={onNetWgtChanged}
                />
                <label className="form__label" htmlFor="wgt"> WGT:</label>
                <input
                    className={`form__input ${validWgtClass}`}
                    id="wgt"
                    name="wgt"
                    type="text"
                    autoComplete="off"
                    value={wgt}
                    onChange={onWgtChanged}
                />
                <label className="form__label" htmlFor="qty"> QTY:</label>
                <input
                    className={`form__input ${validQtyClass}`}
                    id="qty"
                    name="qty"
                    type="text"
                    autoComplete="off"
                    value={qty}
                    onChange={onQtyChanged}
                />
                <label className="form__label" htmlFor="transFare"> TRANS_FARE:</label>
                <input
                    className={`form__input ${validTransFareClass}`}
                    id="transFare"
                    name="transFare"
                    type="text"
                    autoComplete="off"
                    value={transFare}
                    onChange={onTransFareChanged}
                />
                <label className="form__label" htmlFor="price1"> PRICE1:</label>
                <input
                    className={`form__input ${validPrice1Class}`}
                    id="price1"
                    name="price1"
                    type="text"
                    autoComplete="off"
                    value={price1}
                    onChange={onPrice1Changed}
                />
                <label className="form__label" htmlFor="goodsNm"> GOODS_NM:</label>
                <input
                    className={`form__input ${validGoodsNmClass}`}
                    id="goodsNm"
                    name="goodsNm"
                    type="text"
                    autoComplete="off"
                    value={goodsNm}
                    onChange={onGoodsNmChanged}
                />
                <label className="form__label" htmlFor="shipperNm"> SHIPPER_NM:</label>
                <input
                    className={`form__input ${validShipperNmClass}`}
                    id="shipperNm"
                    name="shipperNm"
                    type="text"
                    autoComplete="off"
                    value={shipperNm}
                    onChange={onShipperNmChanged}
                />
                <label className="form__label" htmlFor="consigneeCntryNm"> CONSIGNEE_CNTRY_NM:</label>
                <input
                    className={`form__input ${validConsigneeCntryNmClass}`}
                    id="consigneeCntryNm"
                    name="consigneeCntryNm"
                    type="text"
                    autoComplete="off"
                    value={consigneeCntryNm}
                    onChange={onConsigneeCntryNmChanged}
                />
                <label className="form__label" htmlFor="consigneeNm"> CONSIGNEE_NM:</label>
                <input
                    className={`form__input ${validConsigneeNmClass}`}
                    id="consigneeNm"
                    name="consigneeNm"
                    type="text"
                    autoComplete="off"
                    value={consigneeNm}
                    onChange={onConsigneeNmChanged}
                />
                <label className="form__label" htmlFor="consigneeReg"> CONSIGNEE_REG:</label>
                <input
                    className={`form__input ${validConsigneeRegClass}`}
                    id="consigneeReg"
                    name="consigneeReg"
                    type="text"
                    autoComplete="off"
                    value={consigneeReg}
                    onChange={onConsigneeRegChanged}
                />
                <label className="form__label" htmlFor="consigneeTel"> CONSIGNEE_TEL:</label>
                <input
                    className={`form__input ${validConsigneeTelClass}`}
                    id="consigneeTel"
                    name="consigneeTel"
                    type="text"
                    autoComplete="off"
                    value={consigneeTel}
                    onChange={onConsigneeTelChanged}
                />
                <label className="form__label" htmlFor="compName"> COMP_NAME:</label>
                <input
                    className={`form__input ${validCompNameClass}`}
                    id="compName"
                    name="compName"
                    type="text"
                    autoComplete="off"
                    value={compName}
                    onChange={onCompNameChanged}
                />
                <label className="form__label" htmlFor="compRegister"> COMP_REGISTER:</label>
                <input
                    className={`form__input ${validCompRegisterClass}`}
                    id="compRegister"
                    name="compRegister"
                    type="text"
                    autoComplete="off"
                    value={compRegister}
                    onChange={onCompRegisterChanged}
                />
                <label className="form__label" htmlFor="compAddr"> COMP_ADDR:</label>
                <input
                    className={`form__input ${validCompAddrClass}`}
                    id="compAddr"
                    name="compAddr"
                    type="text"
                    autoComplete="off"
                    value={compAddr}
                    onChange={onCompAddrChanged}
                />
                <label className="form__label" htmlFor="compTel"> COMP_TEL:</label>
                <input
                    className={`form__input ${validCompTelClass}`}
                    id="compTel"
                    name="compTel"
                    type="text"
                    autoComplete="off"
                    value={compTel}
                    onChange={onCompTelChanged}
                />
            </form>
        </>
    )

    return content
}

export default NewPackageeForm