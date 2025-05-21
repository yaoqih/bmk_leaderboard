import pandas as pd
import numpy as np

# 读取TSV数据
def read_tsv_data(file_path):
    return pd.read_csv(file_path, sep='\t')

# 从字符串读取TSV数据
def read_tsv_from_string(tsv_string):
    import io
    return pd.read_csv(io.StringIO(tsv_string), sep='\t')

# TSV数据字符串
tsv_data = """Method	model	mode	Cross CSD Score (Ref-Gen)	Self CSD Score (Gen-Gen)	Cross Cref Score (Ref-Gen)	Self Cref Score (Gen-Gen)	Aesthetics Score	Inception Score	Prompt Align (Scene)	Prompt Align (Camera)	Prompt Align (Character Existence|Number) OCCM	Prompt Align (Global Character Action|Script)	Prompt Align (Local/Single Character Action|Script)	Prompt Align Avg（Alignment score）
Story image method	Storydiffusion	(Img ref) (photomaker)	0.3511	0.5536	0.3379	0.6634	5.125	10.057	1.878	3.266	0.868	2.411	2.23	61.151	
Story image method	Storyadapter	(Img ref)(scale0)	0.4619	0.5537	0.3533	0.6653	4.995	12.978	1.953	3.263	0.857	2.489	2.25	62.218	
Story image method	Storygen	Mix	0.2875	0.5836	0.3414	0.6672	3.836	7.309	0.902	2.116	0.862	1.241	1.484	35.887	
Story image method	UNO (many2many version)	base	0.408	0.6103	0.3938	0.6711	5.232	12.398	3.47	3.062	0.898	2.617	2.121	70.43	
Story image method	Theatergen	base	0.1989	0.4037	0.2708	0.6045	4.897	14.882	2.673	1.645	0.844	0.874	0.875	37.923	
Story image method	Seedstory(AR) 	base	0.2334	0.7486	0.2174	0.5286	3.836	6.325	1.931	1.638	0.859	0.592	0.559	29.499	
Story video method	Vlogger	text only	0.2141	0.4073	0.2686	0.5662	4.334	10.482	1.576	2.854	0.845	2.191	1.982	53.769	
Story video method	Movieagent	SD-3 version	0.3089	0.4826	0.3163	0.607	5.33	15.021	3.456	2.985	0.875	3.233	2.496	76.061	
Story video method	Animdirector	base	0.2983	0.507	0.3388	0.6534	5.599	12.037	3.607	2.887	0.884	3.239	2.435	76.049	
Story video method	MM-StoryAgent	base	0.2528	0.6677	0.3132	0.6459	5.883	9.093	2.832	2.459	0.852	1.688	1.358	52.106	
Naive baseline	base	base	0.7279	0.7154	0.9406	0.9866	4.477	6.719	0.486	2.06	0.997	0.655	0.99	26.197	
"""

def analyze_dimensions(data):
    # 转换所有可能的数值列为浮点数
    metric_cols = data.columns[3:]
    for col in metric_cols:
        data[col] = pd.to_numeric(data[col], errors='coerce')
    
    # 定义五个评估维度及其包含的指标
    dimensions = {
        "Character Consistency(CRef)": [
            "Cross Cref Score (Ref-Gen)", 
            "Self Cref Score (Gen-Gen)"
        ],
        "Style Consistency(SRef)": [
            "Cross CSD Score (Ref-Gen)", 
            "Self CSD Score (Gen-Gen)"
        ],
        "Prompt Alignment": [
            "Prompt Align (Scene)",
            "Prompt Align (Camera)",
            "Prompt Align (Character Existence|Number) OCCM",
            "Prompt Align (Global Character Action|Script)",
            "Prompt Align (Local/Single Character Action|Script)",
            "Prompt Align Avg（Alignment score）"
        ],
        "Generative Quality": [
            "Aesthetics Score"
        ],
        "Diversity": [
            "Inception Score"
        ]
    }
    
    # 计算每个维度中各指标的排名
    dimension_ranks = {}
    for dim_name, metrics in dimensions.items():
        dim_df = pd.DataFrame()
        for metric in metrics:
            if metric in data.columns:
                # 对于Inception Score，值越低越好
                if 'Inception' in metric:
                    dim_df[f"{metric}_rank"] = data[metric].rank(ascending=True)  
                else:
                    # 其他指标值越高越好
                    dim_df[f"{metric}_rank"] = data[metric].rank(ascending=False)
        
        # 如果该维度有有效指标
        if not dim_df.empty:
            # 计算维度的平均排名
            rank_cols = dim_df.columns
            dim_df[f"{dim_name}_avg_rank"] = dim_df[rank_cols].mean(axis=1)
            dimension_ranks[dim_name] = dim_df[f"{dim_name}_avg_rank"]
    
    # 合并所有维度的排名
    for dim_name, ranks in dimension_ranks.items():
        data[f"{dim_name}_avg_rank"] = ranks
        data[f"{dim_name}_rank"] = ranks.rank()
    
    # 计算全部维度的综合排名
    avg_rank_cols = [col for col in data.columns if col.endswith('_avg_rank')]
    data['overall_avg_rank'] = data[avg_rank_cols].mean(axis=1)
    data['overall_rank'] = data['overall_avg_rank'].rank()
    
    # 创建一个简洁的结果数据框
    result_cols = ['Method', 'model', 'mode']
    for dim_name in dimensions.keys():
        result_cols.append(f"{dim_name}_rank")
    result_cols.append('overall_rank')
    
    result_df = data[result_cols].copy()
    
    # 创建方法-模型的唯一标识符，用于按模型分组
    result_df['model_key'] = result_df['Method'] + ' - ' + result_df['model']
    
    # 为每个模型找出最佳模式
    best_modes = result_df.loc[
        result_df.groupby(['model_key'])['overall_rank'].idxmin()
    ].sort_values('overall_rank')
    
    return {
        'all_rankings': result_df,
        'best_modes': best_modes
    }

# 从TSV字符串读取数据
df = read_tsv_from_string(tsv_data)
results = analyze_dimensions(df)

# 输出每个方法-模型在各维度的排名详情
print("各模型在不同维度的排名:")
rankings_display = results['all_rankings'].sort_values('overall_rank')
print(rankings_display)

# 输出每个方法-模型的最佳模式
# print("\n每个模型的最佳模式:")
# best_modes_display = results['best_modes'][['Method', 'model', 'mode', 'overall_rank']]
# print(best_modes_display)

# # 将结果保存为CSV文件
rankings_display.to_csv('dimension_rankings.csv', index=False)
# best_modes_display.to_csv('best_modes.csv', index=False)

# print("\n结果已保存至 dimension_rankings.csv 和 best_modes.csv")