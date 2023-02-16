import { useState, useEffect } from "react"
import { useUpdatePackageeMutation, useDeletePackageeMutation } from "./packageesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

const EditPackageeForm = ({ packagee, users }) => {

    const { isManager, isAdmin } = useAuth()

    const [updatePackagee, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdatePackageeMutation()

    const [deletePackagee, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeletePackageeMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(packagee.title)
    const [text, setText] = useState(packagee.text)
    const [completed, setCompleted] = useState(packagee.completed)
    const [userId, setUserId] = useState(packagee.user)
    const [houseSeq, setHouseSeq] = useState(packagee.houseSeq)

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/packagees')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSavePackageeClicked = async (e) => {
        if (canSave) {
            await updatePackagee({ id: packagee.id, user: userId, title, text, completed })
        }
    }

    const onDeletePackageeClicked = async () => {
        await deletePackagee({ id: packagee.id })
    }

    const created = new Date(packagee.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(packagee.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    })

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <button
                className="icon-button"
                title="Delete"
                onClick={onDeletePackageeClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Packagee #{packagee.ticket}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSavePackageeClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {deleteButton}
                    </div>
                </div>
                <label className="form__label" htmlFor="packagee-title">
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="packagee-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={houseSeq}
                    onChange={onTitleChanged}
                />

                <label className="form__label" htmlFor="packagee-text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="packagee-text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />
                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="packagee-completed">
                            WORK COMPLETE:
                            <input
                                className="form__checkbox"
                                id="packagee-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </label>

                        <label className="form__label form__checkbox-container" htmlFor="packagee-username">
                            ASSIGNED TO:</label>
                        <select
                            id="packagee-username"
                            name="username"
                            className="form__select"
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            {options}
                        </select>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                </div>
            </form>
        </>
    )

    return content
}

export default EditPackageeForm