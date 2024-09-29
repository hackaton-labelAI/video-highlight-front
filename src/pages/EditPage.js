import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Player, ControlBar } from 'video-react';
import 'video-react/dist/video-react.css'; // import css
import './EditPage.css'; // Custom styles for further enhancement

function EditPage({ videoInfo }) {
    const { chunk_id } = useParams();
    const { session_id: urlSessionId } = useParams();
    const session_id = localStorage.getItem('sessionId') || urlSessionId;
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_HTTP}project/${session_id}/open_video/${chunk_id}?add_subtitles=false`);
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
    
    const saveFile = (e) =>{
        const downloadUrl = videoSrc
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'edited_video.mp4'; // Adjust the filename as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { music_filename, music_volume_delta, background_filename, add_subtitles, subtitles_font_name, subtitles_color_name, subtitles_size, subtitles_stroke, subtitles_background } = formData;

        const params = new URLSearchParams();

        if (music_filename) {
            params.append('music_filename', music_filename);
        }

        if (music_volume_delta) {
            params.append('music_volume_delta', music_volume_delta);
        }

        if (background_filename) {
            params.append('background_filename', background_filename);
        }

        params.append('add_subtitles', add_subtitles);

        if (subtitles_font_name) {
            params.append('subtitles_font_name', subtitles_font_name);
        }

        if (subtitles_color_name) {
            params.append('subtitles_color_name', subtitles_color_name);
        }

        if (subtitles_size) {
            params.append('subtitles_size', subtitles_size);
        }

        if (subtitles_stroke) {
            params.append('subtitles_stroke', subtitles_stroke);
        }

        if (subtitles_background) {
            params.append('subtitles_background', subtitles_background);
        }

        const url = `${process.env.REACT_APP_BACKEND_URL_HTTP}project/${session_id}/open_video/${chunk_id}?${params.toString()}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const videoBlob = await response.blob();
                setVideoSrc(URL.createObjectURL(videoBlob));
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
                                <option value="When-I-Was-A-Boy.mp3">When I Was A Boy</option>
                                <option value="dynamic_1.mp3">Dynamic 1</option>
                                <option value="dynamic_2.mp3">Dynamic 2</option>
                                <option value="dynamic_3.mp3">Dynamic 3</option>
                                <option value="ghostrifter-back-home.mp3">Ghostrifter - Back Home</option>
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
                                <option value="Фон_1.mp4">Фон 1</option>
                                <option value="Фон_2.mp4">Фон 2</option>
                                <option value="Фон_3.mp4">Фон 3</option>
                                <option value="Фон_5.mp4">Фон 5</option>
                                <option value="Фон_6.mp4">Фон 6</option>
                                <option value="Фон_9.mp4">Фон 9</option>
                                <option value="gta.mp4">GTA</option>
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
                                <option value="Arial-Narrow-Полужирный">Arial Narrow - Полужирный</option>
                                <option value="Courier-New-Полужирный">Courier New - Полужирный</option>
                                <option value="Georgia-Полужирный">Georgia - Полужирный</option>
                                <option value="Tahoma-Полужирный">Tahoma - Полужирный</option>
                                <option value="Trebuchet-MS-Полужирный">Trebuchet MS - Полужирный</option>
                                <option value="Verdana-Полужирный">Verdana - Полужирный</option>
                                <option value="Arial-Полужирный">Arial - Полужирный</option>
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="subtitles_color_name" className="form-label">Цвет субтитров:</label>
                            <select id="subtitles_color_name" name="subtitles_color_name" className="form-control" value={formData.subtitles_color_name} onChange={handleChange}>
                                <option value="">Выберите цвет текста</option>
                                <option value="white">Белый</option>
                                <option value="black">Чёрный</option>
                                <option value="red">Красный</option>
                                <option value="orange">Оранжевый</option>
                                <option value="yellow">Жёлтый</option>
                                <option value="green">Зелёный</option>
                                <option value="blue">Синий</option>
                                <option value="DarkBlue">Тёмно-синий</option>
                                <option value="purple">Пурпурный</option>
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="subtitles_size" className="form-label">Размер субтитров:</label>
                            <input type="number" id="subtitles_size" name="subtitles_size" className="form-control" value={formData.subtitles_size} onChange={handleChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="subtitles_stroke" className="form-label">Обводка субтитров:</label>
                            <select id="subtitles_stroke" name="subtitles_stroke" className="form-control" value={formData.subtitles_stroke} onChange={handleChange}>
                                <option value="">Выберите цвет текста</option>
                                <option value="white">Белый</option>
                                <option value="black">Чёрный</option>
                                <option value="red">Красный</option>
                                <option value="orange">Оранжевый</option>
                                <option value="yellow">Жёлтый</option>
                                <option value="green">Зелёный</option>
                                <option value="blue">Синий</option>
                                <option value="DarkBlue">Тёмно-синий</option>
                                <option value="purple">Пурпурный</option>
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="subtitles_background" className="form-label">Фон субтитров:</label>
                            <select id="subtitles_background" name="subtitles_background" className="form-control" value={formData.subtitles_background} onChange={handleChange}>
                                <option value="">Выберите цвет текста</option>
                                <option value="white">Белый</option>
                                <option value="black">Чёрный</option>
                                <option value="red">Красный</option>
                                <option value="orange">Оранжевый</option>
                                <option value="yellow">Жёлтый</option>
                                <option value="green">Зелёный</option>
                                <option value="blue">Синий</option>
                                <option value="DarkBlue">Тёмно-синий</option>
                                <option value="purple">Пурпурный</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Применить настройки</button>
                    </form>
                    <button className="btn btn-success mt-3" onClick={saveFile}>Сохранить и скачать видео</button>
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
