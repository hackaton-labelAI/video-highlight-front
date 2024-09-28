import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Player, ControlBar } from 'video-react';
import 'video-react/dist/video-react.css'; // import css
import './EditPage.css'; // Custom styles for further enhancement

function EditPage({ videoInfo }) {
    const { session_id, chunk_id } = useParams();
    const [videoSrc, setVideoSrc] = useState('');
    const [formData, setFormData] = useState({
        music_filename: '',
        music_volume_delta: 0,
        background_filename: '',
        add_subtitles: false,
        subtitles_font_name: '',
        subtitles_color_name: '',
        subtitles_size: 0,
        subtitles_stroke: '',
        subtitles_background: '',
    });

    useEffect(() => {
        const fetchVideo = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_HTTP}project/${session_id}/open_video/${chunk_id}`);
            if (response.ok) {
                const videoBlob = await response.blob();
                setVideoSrc(URL.createObjectURL(videoBlob));
            } else {
                console.error('Error fetching video');
            }
        };

        fetchVideo();
    }, [session_id, chunk_id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_HTTP}project/${session_id}/open_video/${chunk_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const videoBlob = await response.blob();
                const downloadUrl = URL.createObjectURL(videoBlob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'edited_video.mp4'; // Adjust the filename as needed
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                console.error('Error saving video settings');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const formattedTags = videoInfo.json_data.tags.map(tag => `#${tag}`).join(' ');

    return (
        <div className="container mt-4">
            <div className="row" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                {/* Settings Section */}
                <div className="col d-flex flex-column" style={{ flex: 1, marginRight: '10px' }}>
                    <h4 className="mb-4">Настройки</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="music_filename" className="form-label">Музыка:</label>
                            <select id="music_filename" name="music_filename" className="form-control" value={formData.music_filename} onChange={handleChange}>
                                <option value="">Выберите файл музыки</option>
                                {/* Add options for music filenames */}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="music_volume_delta" className="form-label">Громкость музыки:</label>
                            <input type="number" id="music_volume_delta" name="music_volume_delta" className="form-control" value={formData.music_volume_delta} onChange={handleChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="background_filename" className="form-label">Фон:</label>
                            <select id="background_filename" name="background_filename" className="form-control" value={formData.background_filename} onChange={handleChange}>
                                <option value="">Выберите файл фона</option>
                                {/* Add options for background filenames */}
                            </select>
                        </div>
                        <div className="form-group mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="add_subtitles" name="add_subtitles" checked={formData.add_subtitles} onChange={handleChange} />
                            <label className="form-check-label" htmlFor="add_subtitles">Добавить субтитры</label>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="subtitles_font_name" className="form-label">Шрифт субтитров:</label>
                            <select id="subtitles_font_name" name="subtitles_font_name" className="form-control" value={formData.subtitles_font_name} onChange={handleChange}>
                                <option value="">Выберите шрифт</option>
                                {/* Add options for subtitle fonts */}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="subtitles_color_name" className="form-label">Цвет субтитров:</label>
                            <select id="subtitles_color_name" name="subtitles_color_name" className="form-control" value={formData.subtitles_color_name} onChange={handleChange}>
                                <option value="">Выберите цвет</option>
                                {/* Add options for subtitle colors */}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="subtitles_size" className="form-label">Размер субтитров:</label>
                            <input type="number" id="subtitles_size" name="subtitles_size" className="form-control" value={formData.subtitles_size} onChange={handleChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="subtitles_stroke" className="form-label">Обводка субтитров:</label>
                            <select id="subtitles_stroke" name="subtitles_stroke" className="form-control" value={formData.subtitles_stroke} onChange={handleChange}>
                                <option value="">Выберите обводку</option>
                                {/* Add options for subtitle strokes */}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="subtitles_background" className="form-label">Фон субтитров:</label>
                            <select id="subtitles_background" name="subtitles_background" className="form-control" value={formData.subtitles_background} onChange={handleChange}>
                                <option value="">Выберите фон</option>
                                {/* Add options for subtitle backgrounds */}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Сохранить настройки</button>
                    </form>
                    <button className="btn btn-success mt-3" onClick={handleSubmit}>Сохранить и скачать видео</button>
                </div>

                {/* Video Player */}
                <div className="col d-flex justify-content-center" style={{ flex: 2, marginRight: '10px' }}>
                    <div className="border rounded overflow-hidden" style={{ width: '300px', height: '700px' }}>
                        <Player fluid={true} src={videoSrc} className="w-100 h-100">
                            <ControlBar autoHide={true} />
                        </Player>
                    </div>
                </div>

                {/* Video Info Section */}
                <div className="col d-flex flex-column" style={{ flex: 1 }}>
                    <h2 className="mb-4">Инфо</h2>
                    <div className="mb-3">
                        <label className="form-label">Теги:</label>
                        <div>{formattedTags}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Название:</label>
                        <div>{videoInfo.json_data.title}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Описание:</label>
                        <div>{videoInfo.json_data.sub_text}</div>
                    </div>
                    <div>
                        <label className="form-label">Почему имеет приоритет {chunk_id}:</label>
                        <div>{videoInfo.json_data.description}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditPage;
