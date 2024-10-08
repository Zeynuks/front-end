import React, { useState } from 'react';
import { Slide as SlideType, ObjectType, Selected } from '../../source/types.ts';
import { TextObjectComponent } from './TextObject/TextObject.tsx';
import { ImageObjectComponent } from './ImageObject/ImageObject.tsx';
import { Transformable } from "../../view/components/shared/Transformable.tsx";

type SlideProps = {
    slide: SlideType;
    selected: Selected;
    borderRadius?: number;
    onView?: boolean;
};

export const Slide: React.FC<SlideProps> = ({ slide, selected, borderRadius = 0, onView = false }) => {
    const { background, objects } = slide;

    const viewObjects = objects.map((obj) => {
        const [width, setWidth] = useState(obj.size.width);
        const [height, setHeight] = useState(obj.size.height);
        const [x, setX] = useState(obj.position.x);
        const [y, setY] = useState(obj.position.y);
        const [rotation, setRotation] = useState(obj.rotation || 0);
        const isSelected = selected && selected.objectId && selected.objectId.includes(obj.id);

        if (isSelected) {
            return (
                <Transformable
                    key={obj.id}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rotation={rotation}
                    onResize={(newWidth, newHeight) => {
                        setWidth(newWidth);
                        setHeight(newHeight);
                    }}
                    onDrag={(newX, newY) => {
                        setX(newX);
                        setY(newY);
                    }}
                    onRotate={(newRotation) => {
                        setRotation(newRotation);
                    }}
                    onView={onView}
                >
                    {obj.type === ObjectType.Text ? (
                        <TextObjectComponent width={width} height={height} slideObject={obj} onView={onView} />
                    ) : (
                        <ImageObjectComponent width={width} height={height} slideObject={obj} onView={onView} />
                    )}
                </Transformable>
            );
        } else {
            return (
                <g
                    key={obj.id}
                    transform={`translate(${x + width / 2} ${y + height / 2}) rotate(${rotation}) translate(${-width / 2} ${-height / 2})`}
                >
                    {obj.type === ObjectType.Text ? (
                        <TextObjectComponent width={width} height={height} slideObject={obj} onView={onView} />
                    ) : (
                        <ImageObjectComponent width={width} height={height} slideObject={obj} onView={onView} />
                    )}
                </g>
            );
        }
    });

    return (
        <g>
            {background.type === 'color' && (
                <rect
                    x={0}
                    y={0}
                    width={slide.size.width}
                    height={slide.size.height}
                    fill={background.color}
                    rx={borderRadius}
                    ry={borderRadius}
                />
            )}
            {background.type === 'image' && (
                <image
                    href={background.src}
                    x={0}
                    y={0}
                    width={1920}
                    height={1080}
                    preserveAspectRatio="xMidYMid slice"
                />
            )}
            {viewObjects}
        </g>
    );
};
